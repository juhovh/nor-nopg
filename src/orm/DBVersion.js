/* nor-nopg -- NoPg.DBVersion implementation */
"use strict";

//var debug = require('nor-debug');
var util = require("util");
//var events = require("events");
var NoPgORM = require("./ORM.js");

var meta = require('./meta.js')({
	"table": "dbversions",
	"keys": ['$version', '$modified']
});

/** The constructor */
function NoPgDBVersion(opts) {
	var self = this;
	opts = opts || {};
	NoPgORM.call(this);
	meta(self).set_meta_keys(opts).resolve();
}

util.inherits(NoPgDBVersion, NoPgORM);

NoPgDBVersion.meta = meta;

/* Universal typing information */
NoPgDBVersion.prototype.nopg = function() {
	return {
		'orm_type': 'DBVersion'
	};
};

/** Get internal database object */
NoPgDBVersion.prototype.valueOf = function() {
	var self = this;
	return meta(self).unresolve();
};

module.exports = NoPgDBVersion;

/** Update changes to current instance */
NoPgDBVersion.prototype.update = function(data) {
	var self = this;
	//debug.log("NoPg.DBVersion.prototype.update(data = ", data, ")");
	// FIXME: If values are removed from the database, local copy properties are NOT removed currently!
	meta(self).set_meta_keys(data).resolve();
	return self;
};

/* EOF */
