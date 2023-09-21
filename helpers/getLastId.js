const query = require("./queryModule");

async function getLastId(table, col_nm) {
    let q = `SELECT ${col_nm} FROM ${table} ORDER BY ${col_nm} DESC LIMIT 1`
    return await query.customDb(q)
        .then((result) => {
            console.log(result);
            if (result.length === 0) return 0
            return result[0][col_nm] + 1
        }).catch((err) => {
            console.log(err);
            return err
        });

}

module.exports = getLastId