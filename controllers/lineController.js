const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_lines, tb_m_plants } = require('../config/table')
const getLastId = require('../helpers/getLastId')


module.exports = {
    insertDB: async(req, res) => {
        try {
            console.log(req.body);
            req.body.line_id = await getLastId(tb_m_lines, 'line_id')
            req.body.uuid = req.uuid
            req.body.plant_id = await uuidToId(tb_m_plants, 'plant_id', req.body.plant_id)
            req.body.created_by = req.user.user_nm
            let resp = await query.insertDb(tb_m_lines, req.body)
            if (resp) response.success(res, 'success add line')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add line')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) {
                whereCond += `line_id = ${await uuidToId(tb_m_lines, 'line_id', id)}`
            }

            let resp = await query.readDb(tb_m_lines, 'uuid,line_nm,line_snm', whereCond)
            if (resp) response.success(res, 'success read line', resp)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read line')
        }
    },
    updateDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `line_id = ${await uuidToId(tb_m_lines, 'line_id', id)}`
            req.body.plant_id = await uuidToId(tb_m_plants, 'plant_id', req.body.plant_id)
            let resp = await query.updateDb(tb_m_lines, req.body, whereCond)
            if (resp) response.success(res, 'success update line')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update line')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `line_id = ${await uuidToId(tb_m_lines, 'line_id', id)}`
            let resp = await query.softDeleteDb(tb_m_lines, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete line')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete line')
        }
    },
}