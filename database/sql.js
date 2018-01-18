var db = require("./db.js")

exports.drop = function (tables, done) {
    // var pool = state.pool
    if (!pool) return done(new Error('Missing database connection.'))

    async.each(tables, function (name, cb) {
        pool.query('DELETE * FROM ' + name, cb)
    }, done)
},

    exports.insert = function (data, cb) {
        var pool = db.get();
        if (!pool) return done(new Error('Missing database connection.'));
        var table = Object.keys(data);
        var tableName = table[0]
        var row = data[tableName];
        var keys = Object.keys(row);
        values = keys.map(function (key) { return "'" + row[key] + "'" })
        pool.query('INSERT INTO ' + tableName + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
    },

    exports.search = function (data, cb) {
        var pool = db.get();
        if (!pool) return done(new Error('Missing database connection.'));
        pool.query('SELECT * FROM text WHERE NAME =' + "'" + data + "'", cb);
    },

    exports.searchLike = function(data,cb){
        var pool = db.get();
        if(!pool){
            return done(new Error('Missing database connection.'));
        }
        // console.log('SELECT * FROM text WHERE NAME LIKE '+"'%"+data+"%'");
        pool.query('SELECT * FROM text WHERE NAME LIKE '+"'%"+data+"%'",cb);
    },

    exports.update = function (data, cb) {
        var pool = db.get();
        if (!pool) return done(new Error('Missing database connection.'));
        pool.query('UPDATE text SET URL =' + "'" + data.url + "' where NAME = " + "'" + data.name + "'", cb);
    }