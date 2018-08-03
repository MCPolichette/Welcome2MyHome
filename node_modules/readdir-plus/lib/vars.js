var libFs = require("fs");

/**
 * Strategies to handle errors produced by inner functions (stat, read)
 * @enum
 */
exports.ERROR_STRATEGIES = {

	/**
	 * Errors are ignored, not saved anywhere
	 */
	swallow: "swallow",

	/**
	 * Errors are saved under xxxError properties, where xxx is something like 'stat' or 'content'
	 */
	property: "property",

	/**
	 * Errors are saved under original property name ('stat', 'content'), replacing would-be value
	 */
	replace: "replace",

	/**
	 * Error is fatal. Callback will return this error and results won't be provided
	 */
	fatal: "fatal"
};

/**
 * Result file type, determined using stat.isFile / isDirectory...
 * Presumes these types don't overlap (I couldn't find anything to say otherwise)
 * @enum
 */
exports.FILE_TYPES = {
	file: "file",
	directory: "directory",
	symbolicLink: "symbolicLink",
	blockDevice: "blockDevice",
	characterDevice: "characterDevice",
	FIFO: "FIFO",
	socket: "socket"
};

/**
 * The formatting of the results array
 * @enum
 */
exports.RETURN_TYPES = {
	/**
	 * Just file names. eg file1.txt
	 */
	names: "names",

	/**
	 * Paths relative to the starting directory. eg sub/file1.txt
	 */
	relativePaths: "relativePaths",

	/**
	 * Rooted paths. eg /home/user/sub/file1.txt
	 */
	fullPaths: "fullPaths",

	/**
	 * Full details. Needed for advanced options (stat, contents, tree...)
 	 */
	details: "details"
};

exports.DEFAULT_OPTIONS = /** @lends ReaddirPlusOptions.prototype */ {
	/**
	 * Return type
	 */
	return: exports.RETURN_TYPES.details,

	/**
	 * If true, loads up entire directory tree instead of just the content of single directory
	 */
	recursive: true,

	/**
	 * Synchronous call. Returns results instead of callback.
	 */
	sync: false,

	/*
	 * Return results as tree instead of list. Example:
     *
	 *     tree == false            tree == true
	 *     -------------            ------------
	 *     a.txt                    a.txt
	 *     dir/b.txt                dir: { path: 'dir', content: ['dir/b.txt'] }
     *
	 * Content is attached as an array under "content" property.
	 * If return option is anything other than 'detail', directory name is provided as 'path', 'relativePath' or 'name'
	 * You'll probably want to use this in combination with return type 'names'.
	 */
	tree: false,

	/*
	 * List of directories to exclude when recursing. Need to be relative paths.
	 */
	excludeDirs: null,

	/**
	 * Options for directory listing.
	 */
	readdir: {
		/**
		 * What to do in case of an error. See above for details.
		 */
		errorStrategy: exports.ERROR_STRATEGIES.property,

		/**
		 * If error strategy is 'property', error is saved under its own property.
		 * This is set as the 'safe' value where the normal content would otherwise go
		 * In the case of readdir, best leave this alone
		 */
		errorValue: undefined,

		/**
		 * Function that will be used to provide directory listing regardless of sync option
		 * However, if using sync, provided function should act synchronously (no callback).
		 */
		fn: undefined,

		/**
		 * Function to use in async mode
		 */
		fnAsync: libFs.readdir,

		/**
		 * Function to use in sync mode
		 */
		fnSync: libFs.readdirSync
	},

	/**
	 * Options for content loading. Set false/true to disable/enable with default options.
	 * Only loaded in return details mode
	 */
	content: {

		/**
		 * Do try to load content. Saved under 'content' property.
		 * If content hash is provided without this property, it will be auto-set to true
		 */
		enabled: false,

		/**
		 * Max size in bytes
		 */
		maxSize: 1024 * 100, // 100 kb

		/**
		 * Filter functions / regexes for files to be treated as text (loaded with utf-8)
		 * Functions are called with fn(res, stat). Regexes are applied to full path.
		 * Special treatment: if an array is provided as option, its members will be appended to the existing filters.
		 * If you want to replace the defaults, there are two options:
		 *   1) provide single non-array value. Eg: asBinary: function() {...}
		 *   2) wrap your new array into an array. Eg: asText: [[/.txt$/]] // load only .txt files
		 */
		asText: [/(\.txt|\.json|\.csv|\.tsv|\.xml|\.htaccess|\.config|\.cfg|\.html|\.htm|\.xhtml|\.md|\.sh)$/],

		/**
		 * Same as above, except for binaries (loaded as buffers). By default, no binaries are loaded.
		 * Files that are not matched by either will be skipped! Add /.* / to load everything non-text as binary.
		 */
		asBinary: [],

		// Similar as under readdir
		errorStrategy: exports.ERROR_STRATEGIES.property,
		errorValue: {},
		fn: undefined,
		fnAsync: libFs.readFile,
		fnSync: libFs.readFileSync
	},

	/**
	 * Options for stating files.
	 */
	stat: {
		/**
		 * If false, do not save file stats under 'stat' property. Note that stats might be taken anyway,
		 * depending on other options. They just won't be saved unless this is true.
		 */
		enabled: true,

		// Similar as under readdir
		errorStrategy: exports.ERROR_STRATEGIES.property,
		errorValue: null,
		fn: undefined,
		fnAsync: libFs.lstat,
		fnSync: libFs.lstatSync
	},

	/**
	 * Filter results based on file type. Types are based on stat object's isXXX methods.
	 * See here for details: http://nodejs.org/api/fs.html#fs_class_fs_stats
	 * Filters can be:
	 *   - true/false
	 *   - RegExp
	 *   - function (resultObject) { return true / false; }
	 *   "any" option will always be applied, alongside one other filter determined by type.
	 * You can also set a global filter: true/false/RegExp/function property, that will be applied
	 * regardless of type.
	 */
	filter: {
		any: true,
		file: true,
		directory: false,
		symbolicLink: false,
		blockDevice: false,
		characterDevice: false,
		FIFO: false,
		socket: false
	}
};

/**
 * File data returned by readdirPlus
 * @param source
 */
function ReaddirPlusFile(source) {
	/**
	 * File name. Eg. "file.txt"
	 * @type {string}
	 */
	this.name = null;

	/**
	 * Full path. Eg. "/home/myname/path/to/directory/subdir/file.txt"
	 * @type {string}
	 */
	this.path = null;

	/**
	 * Relative path, based on the directory you submitted to readdir. Eg. "subdir/file.txt"
	 * @type {string}
	 */
	this.relativePath = null;

	/**
	 * File name without extension. Eg. "file"
	 * @type {string}
	 */
	this.basename = null;

	/**
	 * Extension with leading dot. Eg. ".txt"
	 * @type {string}
	 */
	this.extension = null;

	/**
	 * One of vars.FILE_TYPES
	 * @type {FILE_TYPES}
	 */
	this.type = null;

	/**
	 * File or directory stats
	 * @type {fs.Stats}
	 */
	this.stat = null;

	Object.assign(this, source);
}
exports.ReaddirPlusFile = ReaddirPlusFile;