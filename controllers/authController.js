const { tb_m_users } = require('../config/table');
const auth = require('../helpers/auth');
const { readDb } = require('../helpers/queryModule')
const response = require('../helpers/response')

module.exports = {
    login: async(req, res) => {
        // using noreg, password
        try {
            let user = await readDb(tb_m_users, '*', `WHERE noreg = '${req.body.noreg}'`)
            let if_user_avail = user.length > 0
            if (if_user_avail) {
                let token = await auth.generateToken(user[0])
                response.success(res, 'success login', token)
            }
        } catch (error) {
            console.log(error);
            response.failed(res, `Noreg / password salah (error)`)
        }
    }
}