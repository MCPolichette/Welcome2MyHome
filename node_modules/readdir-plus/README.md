readdir-plus
============

fs.readdir with additional options. Features:

- Multiple return types: names, paths, relative paths, details (with parts parsed + file type)
- Optional recursive search
- Loads stat for each found file / directory. Optionally disable for better performance.
- Detailed filtering by file type, regex and/or callback
- Produce tree structure or flat list
- Synchronous option
- Load content of found files (binary or text determined by extension) *(TODO)* 
- Zero dependencies
- Tests

**************

### Basic usage

```javascript

var readdir = require("readdir-plus");

readdir("/path/to/directory", function (err, files) {
	//... do something with files
});

```

By default, readdir will recurse all subdirectories and present each found file as a hash with the following properties:

```javascript
{
	name: "file.txt",
	path: "/home/myname/path/to/directory/subdir/file.txt",
	relativePath: "subdir/file.txt", 
	extension: ".txt",
	type: "file", // see vars.FILE_TYPES for what else can be here 
	stat: { /* instance of node's fs.Stats class for this file */ }
}
```

See [here](https://nodejs.org/api/fs.html#fs_class_fs_stats) for details on node's `fs.Stats` class.

### Load file content

```javascript
readdir("/path/to/directory", {content: "true"}, function (err, results) {
	console.log(results[0].content);
});
```
This prints out the contents of the first found file. Contents are loaded as strings or Buffers, based on extension sniffing.

### Just the file list

```javascript
readdir("/path/to/directory", {return: "names", recursive: false}, callback);
```

Returns

```javascript
[
	"file1.txt",
	"file2.txt",
	//...
]
```

This now works the same as native readdir function.

##### For more examples, see unit tests

**************

## Options

All options with defaults and helpful comments can be seen [here](lib/vars.js).


**************

## Licence

Apache v2. Read it [here](LICENCE).