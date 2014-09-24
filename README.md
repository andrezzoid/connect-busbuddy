
Description
===========

Connect middleware for [busboy](https://github.com/mscdex/busboy).


Requirements
============

* [node.js](http://nodejs.org/) -- v0.8.0 or newer


Install
============
```
npm install connect-busbuddy
```


Example
=======

```javascript
var busbuddy = require('connect-busbuddy');

// default options, no immediate parsing
app.use(busbuddy());
// ...
app.use(function(req, res) {
    var prop = req.body['my-input'];
    
    var file = req.files['my-file'].file;
    var filename = req.files['my-file'].filename;
	var dst = fs.createWriteStream('./uploads/' + filename);
	file.pipe(dst);
});
```

```javascript
// any valid Busboy options can be passed in also
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
}));

```

Licence
=======

MIT - https://github.com/andrezzoid/connect-busbuddy/blob/master/LICENSE
