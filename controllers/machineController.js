const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_machines, tb_m_lines, v_mc_params } = require('../config/table')
const getLastId = require('../helpers/getLastId')


module.exports = {
    insertDB: async(req, res) => {
        try {
            req.body.machine_id = await getLastId(tb_m_machines, 'machine_id')
            req.body.uuid = req.uuid
            req.body.line_id = await uuidToId(tb_m_lines, 'line_id', req.body.line_id)
            req.body.created_by = req.user.user_nm
            let resp = await query.insertDb(tb_m_machines, req.body)
            if (resp) response.success(res, 'success add machine')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add machine')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) {
                whereCond += `machine_id = ${await uuidToId(tb_m_machines, 'machine_id', id)}`
            }
            let q = `SELECT uuid as mc_param_id , machine_id, line_nm, machine_nm, x_axis, y_axis, tag_name, reg_value FROM v_mc_params`
            let resp = await query.customDb(q)
                // let resp = await query.readDb(tb_m_machines, 'uuid,machine_nm', whereCond)
            if (resp) response.success(res, 'success read machine', resp)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read machine')
        }
    },
    updateDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `machine_id = ${await uuidToId(tb_m_machines, 'machine_id', id)}`
            req.body.line_id = await uuidToId(tb_m_lines, 'line_id', req.body.line_id)
            let resp = await query.updateDb(tb_m_machines, req.body, whereCond)
            if (resp) response.success(res, 'success update machine')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update machine')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `machine_id = ${await uuidToId(tb_m_machines, 'machine_id', id)}`
            let resp = await query.softDeleteDb(tb_m_machines, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete machine')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete machine')
        }
    },
}