async function cmdMultipleQuery(sql) {
    const mysql = require('mysql2')
    require('dotenv').config()
    var pool = await mysql.createPool({
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
        connectionLimit: 99,
        // timezone: 'utc',
        connectTimeout: 60000
    });
    
    const poolPromise = pool.promise();

    const [rows, fields] = await poolPromise.query(sql)
    await poolPromise.end()
    return rows
    // return new Promise((resolve, reject) => {
    //     pool.getConnection(function(err, connection) {
    //         if (err) {
    //             console.log(err);
    //             reject(err);
    //         }
    //         connection.query(sql, function(err, result) {
    //             if (err) {
    //                 console.log(err);
    //                 reject(err);
    //             }
    //             resolve(result);
    //             // connection.destroy()
    //             // connection.release()
    //             pool.releaseConnection(connection);
    //         });
    //     });
    //     // pool.releaseConnection()
    // });
}


module.exports = cmdMultipleQuery