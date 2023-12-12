const moment = require("moment");
const cmdMultipleQuery = require("../config/database");

module.exports = {
    insertDb: async(tb_name, colsVals) => {
        try {
            let containerCols = []
            let containerVals = []
            console.log(colsVals);
            for (const key in colsVals) {
                containerCols.push(key)
                containerVals.push(`'${colsVals[key]}'`)
            }
            let q = `INSERT INTO ${tb_name} (${containerCols.join(',')}) VALUES (${containerVals.join(',')})`
            return cmdMultipleQuery(q)
                .then(result => {
                    // console.log(result);
                    return result
                })

        } catch (error) {
            console.log(error);
            return error
        }
    },
    insertBulkDb: async(tb_name, colsVals) => {
        try {
            let containerColumn = []
            let containerValues = []
            let mapBulkData = await colsVals.map(item => {
                containerValues = []
                for (const key in item) {
                    if (key != 'childs') {
                        if (item[key]) {
                            console.log();
                            if (typeof item[key] == 'object') {
                                containerValues.push(`'{${item[key].join(',')}}'`)
                            } else {
                                containerValues.push(`'${item[key]}'`)
                            }
                        } else {
                            containerValues.push(`NULL`)
                        }
                    }
                }
                return `(${containerValues.join(',')})`
            })
            for (const key in colsVals[0]) {
                containerColumn.push(key)
            }
            let q = `INSERT INTO ${tb_name} (${containerColumn.join(',')}) VALUES ${mapBulkData.join(',')}`
            return cmdMultipleQuery(q)
                .then(result => {
                    // console.log(result);
                    return true
                })

        } catch (error) {
            console.log(error);
            return error
        }
    },
    readDb: async(tb_name, cols, whereCond, orderBy = false) => {
        try {
            console.log(whereCond);
            let q = `SELECT ${cols} FROM ${tb_name} WHERE deleted_at IS NULL`
            if (whereCond) q += ` AND ${whereCond}`
            if (orderBy) q += orderBy
            console.log(q);
            return cmdMultipleQuery(q)
                .then(result => {
                    // console.log(result);
                    return result
                })
        } catch (error) {
            console.log(error);
            return error
        }
    },
    updateDb: async(tb_name, colsVals, whereCond, req = false) => {
        try {
            let containerSets = []
            console.log(colsVals);
            for (const key in colsVals) {
                containerSets.push(`${key} = '${colsVals[key]}'`)
            }
            // if (req) {
            //     containerSets.push(`modified_at = CURRENT_TIMESTAMP()`)
            //     containerSets.push(`modified_by = ${req.user.user_nm}`)
            // }

            let q = `UPDATE ${tb_name} SET ${containerSets.join(',')} WHERE`
            if (whereCond) q += ` ${whereCond}`
            return cmdMultipleQuery(q)
                .then(result => {
                    console.log(result);
                    return result
                })
        } catch (error) {
            console.log(error);
            return error
        }
    },
    deleteDb: async(tb_name, whereCond) => {
        try {
            let q = `DELETE FROM ${tb_name} WHERE ${whereCond}`
            return cmdMultipleQuery(q)
                .then(result => {
                    console.log(result);
                    return result
                })
        } catch (error) {
            console.log(error);
            return error
        }
    },
    softDeleteDb: async(tb_name, user, whereCond) => {
        try {
            // set deleted_at and deleted_by
            let deleted_at = moment().format('YYYY-MM-DD')
            let q = `UPDATE ${tb_name} SET deleted_at = '${deleted_at}', deleted_by = '${user}' WHERE ${whereCond}`
            return cmdMultipleQuery(q)
                .then(result => {
                    console.log(result);
                    return result
                })
        } catch (error) {
            console.log(error);
            return error
        }
    },
    customDb: async(q) => {
        try {
            return cmdMultipleQuery(q)
                .then(result => {
                    return result
                })
        } catch (error) {
            console.log(error);
            return error
        }
    },
}