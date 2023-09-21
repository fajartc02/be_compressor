const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
const { tb_m_companies } = require('../config/table')
const getLastId = require('../helpers/getLastId')


module.exports = {
    insertDB: async(req, res) => {
        try {
            req.body.company_id = await getLastId(tb_m_companies, 'company_id')
            req.body.uuid = req.uuid
            req.body.created_by = req.user.user_nm
            let resp = await query.insertDb(tb_m_companies, req.body)
            if (resp) response.success(res, 'success add company')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add company')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) {
                whereCond += `company_id = ${await uuidToId(tb_m_companies, 'company_id', id)}`
            }

            let resp = await query.readDb(tb_m_companies, 'uuid,company_nm', whereCond)
            if (resp) response.success(res, 'success read company', resp)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read company')
        }
    },
    updateDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `company_id = ${await uuidToId(tb_m_companies, 'company_id', id)}`
            let resp = await query.updateDb(tb_m_companies, req.body, whereCond)
            if (resp) response.success(res, 'success update company')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update company')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `company_id = ${await uuidToId(tb_m_companies, 'company_id', id)}`
            let resp = await query.softDeleteDb(tb_m_companies, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete company')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete company')
        }
    },
}