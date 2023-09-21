const query = require('../helpers/queryModule')


const uuidToId = async(table, col, uuid) => {
    console.log(`SELECT ${col} FROM ${table} WHERE uuid = '${uuid}'`);
    let rawId = await query.customDb(`SELECT ${col} FROM ${table} WHERE uuid = '${uuid}'`)
    return rawId[0][col]
}


module.exports = uuidToId