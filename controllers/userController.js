const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const security = require('../helpers/security')
const { tb_m_users } = require('../config/table')

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
            response.failed(res, 'Error add user')
        }
    }
}