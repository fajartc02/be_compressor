const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_machines, tb_m_lines, tb_m_mc_parameters } = require('../config/table')
const getLastId = require('../helpers/getLastId')
const { v4 } = require('uuid')


module.exports = {
    insertDB: async(req, res) => {
        try {
            const { param_ids } = req.body
            req.body.machine_id = await getLastId(tb_m_machines, 'machine_id')
            req.body.uuid = req.uuid
            req.body.line_id = await uuidToId(tb_m_lines, 'line_id', req.body.line_id)
            req.body.created_by = req.user.user_nm

            // Condition for add param_id to mc_params [id, id]
            // create parameter
            if (param_ids) {
                var containerQuery = []
                let mc_param_lastId = await getLastId(tb_m_mc_parameters, 'mc_param_id')
                var mapMcParam = await param_ids.map((param, i) => {
                    return {
                        mc_param_id: mc_param_lastId + i,
                        uuid: v4(),
                        client_hdl: param,
                        machine_id: req.body.machine_id
                    }
                })
                for (let i = 0; i < mapMcParam.length; i++) {
                    const element = mapMcParam[i];
                    containerQuery.push(`(${element.mc_param_id}, "${element.uuid}", "${element.machine_id}", "${element.client_hdl}")`)
                }
                var queryMcParam = `INSERT INTO tb_m_mc_parameters(mc_param_id, uuid, machine_id, param_id) VALUES ${containerQuery.join(',')}`
            }
            delete req.body.param_ids
            let respMc = await query.insertDb(tb_m_machines, req.body)
            if (param_ids) await query.customDb(queryMcParam)



            if (respMc) response.success(res, 'success add machine')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add machine')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id, line_id, plant_id } = req.query
            let whereCond = []
            if (id) whereCond.push(`machine_id = '${id}'`)
            if (line_id) whereCond.push(`line_id = '${line_id}'`)
            if (plant_id) whereCond.push(`plant_id = '${plant_id}'`)
            if (whereCond.length > 0) whereCond.join(' AND ')
            let q = `SELECT ROW_NUMBER() OVER() as no, uuid as mc_param_id , machine_id,line_id, line_nm, machine_nm, x_axis, y_axis, tag_name, reg_value as status FROM v_mc_params ${whereCond.length > 0 ? 'WHERE ' + whereCond : ''}`
            console.log(q);
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