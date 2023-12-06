const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')

const { tb_m_conjuntions } = require('../config/table')
const getLastId = require('../helpers/getLastId')
const { v4 } = require('uuid')


module.exports = {
    readDb: async(req, res) => {
        try {
            let resp = await query.readDb(tb_m_conjuntions, ['uuid as conjunction_id', 'conjunction_nm', 'conjunction_desc'])
            response.success(res, 'Success to get conjunctions', resp)
        } catch (error) {
            console.error(error)
            response.error(res, 'Failed to get conjunctions')
        }
    }
}