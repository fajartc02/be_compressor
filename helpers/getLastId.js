const query = require("./queryModule");

async function getLastId(table, col_nm) {
    return await query.readDb(table, col_nm, ` ORDER BY ${col_nm} DESC LIMIT 1`)
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