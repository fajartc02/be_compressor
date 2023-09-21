function cmdMultipleQuery(sql) {
    const mysql = require('mysql2')
    require('dotenv').config()
    var pool = mysql.createPool({
        // connectionLimit: 100, // default = 10
        host: process.env.HOST_DB_NEW,
        user: process.env.USER_DB_NEW,
        port: 3306,
        password: process.env.PASSWORD_DB_NEW,
        database: process.env.NAME_DB_NEW,
        multipleStatements: true,
        queueLimit: 0,
        waitForConnections: true,
        timezone: 'Z',
        // connectionLimit: 10,
        // timezone: 'utc',
        connectTimeout: 60000
    });
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log(err);
                reject(err);
            }
            connection.query(sql, function(err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(result);
                // connection.destroy()
                // connection.release()
            });
            // pool.releaseConnection(connection);
        });
    });
}


module.exports = cmdMultipleQuery