const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_plants, tb_m_companies } = require('../config/table')
const getLastId = require('../helpers/getLastId')


module.exports = {
    insertDB: async(req, res) => {
        try {
            req.body.plant_id = await getLastId(tb_m_plants, 'plant_id')
            req.body.uuid = req.uuid
            req.body.background = req.file.path
            req.body.company_id = await uuidToId(tb_m_companies, 'company_id', req.body.company_id)
            req.body.created_by = req.user.user_nm
            let resp = await query.insertDb(tb_m_plants, req.body)
            if (resp) response.success(res, 'success add plant')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add plant')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) {
                whereCond += `plant_id = ${await uuidToId(tb_m_plants, 'plant_id', id)}`
            }

            let resp = await query.readDb(tb_m_plants, 'uuid,plant_nm,background', whereCond)
            if (resp) response.success(res, 'success read plant', resp)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read plant')
        }
    },
    updateDB: async(req, res) => {
        try {
            console.log(req.file);
            if (req.file) req.body.background = req.file.path
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `plant_id = ${await uuidToId(tb_m_plants, 'plant_id', id)}`
            req.body.company_id = await uuidToId(tb_m_companies, 'company_id', req.body.company_id)
            let resp = await query.updateDb(tb_m_plants, req.body, whereCond)
            if (resp) response.success(res, 'success update plant')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update plant')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `plant_id = ${await uuidToId(tb_m_plants, 'plant_id', id)}`
            let resp = await query.softDeleteDb(tb_m_plants, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete plant')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete plant')
        }
    },
}