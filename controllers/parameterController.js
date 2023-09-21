const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_parameters } = require('../config/table')
const getLastId = require('../helpers/getLastId')

module.exports = {
    insertDB: async(req, res) => {
        try {
            req.body.client_hdl = await getLastId(tb_m_parameters, 'client_hdl')
            let resp = await query.insertDb(tb_m_parameters, req.body)
            if (resp) response.success(res, 'success add parameter')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add parameter')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) {
                whereCond += `client_hdl = ${id}`
            }

            let resp = await query.readDb(tb_m_parameters, '*', whereCond)
            if (resp) response.success(res, 'success read parameter', resp)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read parameter')
        }
    },
    updateDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `client_hdl = ${id}`
            let resp = await query.updateDb(tb_m_parameters, req.body, whereCond)
            if (resp) response.success(res, 'success update parameter')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update parameter')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `client_hdl = ${id}`
            let resp = await query.softDeleteDb(tb_m_parameters, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete parameter')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete parameter')
        }
    }
}