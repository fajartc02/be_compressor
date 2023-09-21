const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_mc_parameters, tb_m_machines } = require('../config/table')
const getLastId = require('../helpers/getLastId')


module.exports = {
    insertDB: async(req, res) => {
        try {
            req.body.mc_param_id = await getLastId(tb_m_mc_parameters, 'mc_param_id')
            req.body.uuid = req.uuid
            req.body.machine_id = await uuidToId(tb_m_machines, 'machine_id', req.body.machine_id)
            req.body.param_id = req.body.param_id
            req.body.created_by = req.user.user_nm
            let resp = await query.insertDb(tb_m_mc_parameters, req.body)
            if (resp) response.success(res, 'success add machine parameter')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add machine parameter')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) {
                whereCond += `mc_param_id = ${await uuidToId(tb_m_mc_parameters, 'mc_param_id', id)}`
            }
            let resp = await query.readDb(tb_m_mc_parameters, 'uuid,machine_id,param_id', whereCond)
            if (resp) response.success(res, 'success read machine parameter', resp)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read machine parameter')
        }
    },
    updateDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `mc_param_id = ${await uuidToId(tb_m_mc_parameters, 'mc_param_id', id)}`
            req.body.machine_id = await uuidToId(tb_m_machines, 'machine_id', req.body.machine_id)
            req.body.param_id = req.body.param_id
            let resp = await query.updateDb(tb_m_mc_parameters, req.body, whereCond)
            if (resp) response.success(res, 'success update machine parameter')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update machine parameter')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `mc_param_id = ${await uuidToId(tb_m_mc_parameters, 'mc_param_id', id)}`
            let resp = await query.softDeleteDb(tb_m_mc_parameters, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete machine parameter')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete machine parameter')
        }
    },
}