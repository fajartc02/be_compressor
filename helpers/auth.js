const jwt = require('jsonwebtoken');
const response = require('./response')
const { v4 } = require('uuid')
const table = require('../config/table');
const cmdMultipleQuery = require('../config/database');

async function userCheck(noreg) {
    try {
        let q = `SELECT * FROM ${table.tb_m_users} WHERE noreg = '${noreg}'`
        let resp = await cmdMultipleQuery(q)
        return resp[0]
    } catch (error) {
        return error
    }
}


module.exports = {
    generateToken: async(payload) => {
        var token = await jwt.sign(payload, process.env.SECRET_KEY);
        return token
    },
    verifyToken: async(req, res, next) => {
        try {
            let authorization = req.headers["authorization"];

            if (!authorization) {
                return response.notAllowed(res, 'No token provide')
            }
            let isBearer = authorization.split(" ")[0] == 'Bearer'
            let token = authorization.split(" ")[1];
            if (isBearer) {
                if (!token) response.notAllowed(res, 'No token provide');
                let userDataVerify = await jwt.verify(token, process.env.SECRET_KEY)
                let userData = await userCheck(userDataVerify.noreg)
                req.user = userData
                req.uuid = v4()
                next()
            } else {
                response.notAllowed(res, 'Token Is Invalid');
            }
        } catch (error) {
            response.notAllowed(res, 'Token Is Invalid');
        }
    },
    isAdmin: async(req, res, next) => {
        console.log("i'm admin");
        if (req.user.is_admin === 1) {
            next()
        } else {
            response.notAllowed(res, 'Only admin can do this action');
        }
    }
}