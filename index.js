'use strict';

var Busboy = require('busboy'),
  stream = require('stream');

var RE_MIME = /^(?:multipart\/.+)|(?:application\/x-www-form-urlencoded)$/i;

module.exports = function(options) {
  options = options || {};

  return function(req, res, next) {
    if (req.method === 'GET'
        || req.method === 'HEAD'
        || !hasBody(req)
        || !RE_MIME.test(mime(req)))
      return next();

    var cfg = {};
    for (var prop in options)
      cfg[prop] = options[prop];
    cfg.headers = req.headers;

    var busboy = new Busboy(cfg);

    // Create files and body properties
    req.files = {};
    req.body = {};

    busboy.on('field', function(fieldname, val) {
      req.body[fieldname] = val;
    });

    busboy.on('file', function(fieldname, file, filename){
      // The PassThrough serves only to pipe the file stream
      // or busboy won't finish
      var source = stream.PassThrough({ objectMode: true });
      req.files[fieldname] = {
        filename: filename,
        file: source
      };

      file.pipe(source);
    });

    busboy.on('finish', function(){
      next();
    });
    
    req.pipe(busboy);
  }
};

// utility functions copied from Connect

function hasBody(req) {
  var encoding = 'transfer-encoding' in req.headers,
    length = 'content-length' in req.headers
    && req.headers['content-length'] !== '0';
  return encoding || length;
};

function mime(req) {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
};