const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const security = require('../helpers/security')
const { tb_m_users } = require('../config/table')
const uuidToId = require('../helpers/UUIDtoID')

module.exports = {
    insertDB: async(req, res) => {
        try {
            let unreadPassword = await security.encryptPassword(req.body.password)

            //  uuid, noreg, user_nm, phone_no, password, (future) created_by
            req.body.password = unreadPassword
            req.body.uuid = req.uuid
            req.body.created_by = req.user.user_nm
            let resp = await query.insertDb(tb_m_users, req.body)
            if (resp) response.success(res, 'success add user')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error add user / Noreg tidak boleh sama')
        }
    },
    readDB: async(req, res) => {
        try {
            let { id } = req.query
            let whereCond = ''
            if (id) whereCond += `user_id = ${await uuidToId(tb_m_users, 'user_id', id)}`
            let userData = await query.readDb(tb_m_users, 'row_number() OVER () as no, uuid as user_id, noreg, user_nm, phone_no, is_admin as status', `${whereCond}`)
            console.log(userData);
            response.success(res, 'success GET user', userData)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error get user')
        }
    },
    updateDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `user_id = ${await uuidToId(tb_m_users, 'user_id', id)}`
            let resp = await query.updateDb(tb_m_users, req.body, whereCond)
            if (resp) response.success(res, 'success update user')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error update user')
        }
    },
    softDeleteDB: async(req, res) => {
        try {
            let { id } = req.params
            let whereCond = ''
            if (id) whereCond += `user_id = ${await uuidToId(tb_m_users, 'user_id', id)}`
            let resp = await query.softDeleteDb(tb_m_users, req.user.user_nm, whereCond)
            if (resp) response.success(res, 'success delete user')
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error delete user')
        }
    },
}