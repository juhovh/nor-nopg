"use strict";

var Q = require('q');
Q.longStackSupport = true;

var is = require('nor-is');
var assert = require('assert');
var util = require('util');
var PGCONFIG = process.env.PGCONFIG || 'pg://postgres@localhost/test';
var debug = require('nor-debug');
var nopg = require('../src');

/** Run init() at start */
before(function(done){
	nopg.start(PGCONFIG).init().then(function(db) {
		//var doc = db.fetch();
		//util.debug('initialized database: doc = ' + util.inspect(doc));
		return db.commit();
	}).then(function(db) {
		debug.log('Database init was successful.');
		done();
	}).fail(function(err) {
		debug.log('Database init failed: ' + err);
		done(err);
	}).done();
});

/* */
describe('nopg', function(){

	describe('.start', function(){

		it('is callable', function(){
			assert.strictEqual(typeof nopg.start, 'function');
		});

	});

	describe('tests', function() {

		it('.create()({"hello":"world"}) works', function(done){
			nopg.start(PGCONFIG).create()({"hello":"world"}).then(function(db) {
				debug.log('db is ', db);
				var doc = db.fetch();
				util.debug('doc = ' + util.inspect(doc));
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'world');
				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

		it('.createType("Test") and .create("Test")({"hello":"world"}) works', function(done){
			nopg.start(PGCONFIG).createType("Test")({"schema":{"type":"object"}}).create("Test")({"hello":"world"}).then(function(db) {
				debug.log('db is ', db);
				var type = db.fetch();
				var doc = db.fetch();
				util.debug('doc = ' + util.inspect(doc));
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'world');
				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

		it('.create()({"hello":"world"}) and .update(doc, {"hello": "another"}) works', function(done){
			var doc;
			nopg.start(PGCONFIG).create()({"hello":"world"}).then(function(db) {
				doc = db.fetch();
				util.debug('before doc = ' + util.inspect(doc));
				return db.update(doc, {"hello": "another"});
			}).then(function(db) {
				util.debug('updated doc = ' + util.inspect(doc));
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'another');
				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

		it('.create()({"hello":"world"}) and .update(doc) works', function(done){
			var doc;
			nopg.start(PGCONFIG).create()({"hello":"world"}).then(function(db) {
				doc = db.fetch();
				util.debug('before doc = ' + util.inspect(doc));
				doc.hello = "another";
				return db.update(doc);
			}).then(function(db) {
				util.debug('updated doc = ' + util.inspect(doc));
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'another');
				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

		it('.create()({"hello":"world"}) and .del(doc) works', function(done){
			var doc;
			nopg.start(PGCONFIG).create()({"hello":"world"}).then(function(db) {
				doc = db.fetch();
				util.debug('before doc = ' + util.inspect(doc));
				return db.del(doc);
			}).then(function(db) {
				// FIXME: Test that the doc was really deleted.
				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

		it('.search()({"hello":"world"}) works', function(done){
			nopg.start(PGCONFIG).create()({"hello":"UAJuE5ya6m9UvUM87GUFu7GBIJWghHMT"}).then(function(db) {
				debug.log('db is ', db);
				var doc = db.fetch();
				util.debug('doc = ' + util.inspect(doc));
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'UAJuE5ya6m9UvUM87GUFu7GBIJWghHMT');

				return db.search()({"hello":"UAJuE5ya6m9UvUM87GUFu7GBIJWghHMT"});
			}).then(function(db) {
				var items = db.fetch();

				assert.strictEqual(items.length, 1);
				var doc = items.shift();
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'UAJuE5ya6m9UvUM87GUFu7GBIJWghHMT');

				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

		it('.search()({"hello":"world"}) works', function(done){
			var id;
			nopg.start(PGCONFIG).create()({"hello":"AF82RqSsXM527S3PGK76r6H3xjWqnYgP"}).then(function(db) {
				debug.log('db is ', db);
				var doc = db.fetch();
				util.debug('doc = ' + util.inspect(doc));
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'AF82RqSsXM527S3PGK76r6H3xjWqnYgP');

				id = doc.$id;

				return db.search()({"$id":doc.$id});
			}).then(function(db) {
				var items = db.fetch();

				assert.strictEqual(items.length, 1);
				var doc = items.shift();
				assert.strictEqual(typeof doc.hello, 'string');
				assert.strictEqual(doc.hello, 'AF82RqSsXM527S3PGK76r6H3xjWqnYgP');

				return db.commit();
			}).then(function(db) {
				done();
			}).fail(function(err) {
				debug.log('Database query failed: ' + err);
				done(err);
			}).done();
		});

	});

});

/* EOF */
