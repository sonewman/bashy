//	Basically the same as Domanic Tarr's through stream
//	except implemented using streams2
module.exports = thru;

var PassThrough = require('stream').PassThrough;

function thru (fn, finish) {
	var p  = new PassThrough();
	if ('function' === typeof fn) p._transform = fn;
	if ('function' === typeof finish) p.once('finish', finish);
	return p;
}