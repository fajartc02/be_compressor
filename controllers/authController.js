const { tb_m_users } = require('../config/table');
const auth = require('../helpers/auth');
const { readDb } = require('../helpers/queryModule')
const response = require('../helpers/response');
const security = require('../helpers/security');

module.exports = {
    login: async(req, res) => {
        // using noreg, password
        try {
            let user = await readDb(tb_m_users, '*', `noreg = '${req.body.noreg}'`)
            let if_user_avail = user.length > 0
            await security.decryptPassword(req.body.password, user[0].password)
            if (if_user_avail) {
                let userObj = {
                    user_nm: user[0].user_nm,
                    noreg: user[0].noreg
                }
                let token = await auth.generateToken(user[0])
                response.success(res, 'success login', { token, user: userObj })
            }
        } catch (error) {
            console.log(error);
            response.failed(res, `Noreg / password salah (error)`)
        }
    }
}