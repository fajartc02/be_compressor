const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_machines, tb_m_lines, v_mc_params, t_transmit } = require('../config/table')

module.exports = {
    iotOnCompressor: async(req, res) => {
        /*
            1. Check status on reg_value view table
            1. get data from view
            2. collect some data (dev_name, group_name, tag_name) add TTL
            3. write value to t_transmit (dev_name, reg_name, reg_value = 1, ttl = 1)
        */
        try {
            const { machine_id } = req.params
            let raw_status = await query.readDb(v_mc_params, 'reg_value,deleted_at,dev_name, group_name, tag_name', `machine_id = '${machine_id}'`)
            let comp_status = await raw_status[0]

            if (comp_status.reg_value) return response.error(res, 'Compressor is currently ON')
            let objIot = {
                dev_name: `${comp_status.dev_name}.${comp_status.group_name}`,
                reg_name: comp_status.tag_name,
                reg_value: 1,
                ttl: 1
            }
            let resp = await query.insertDb(t_transmit, objIot)
            console.log(resp);
            return response.success(res, 'Success to turn ON compressor')

        } catch (error) {
            console.log(error);
            response.failed(res, 'Failed to on compressor')
        }
    },
    iotOffCompressor: async(req, res) => {
        /*
            1. Check status on reg_value view table
            1. get data from view
            2. collect some data (dev_name, group_name, tag_name) add TTL
            3. write value to t_transmit (dev_name, reg_name, reg_value = 1, ttl = 1)
        */
        try {
            const { machine_id } = req.params
            let raw_status = await query.readDb(v_mc_params, 'reg_value,deleted_at,dev_name, group_name, tag_name', `machine_id = '${machine_id}'`)
            let comp_status = await raw_status[0]

            if (!comp_status.reg_value) return response.error(res, 'Compressor is currently OFF')
            let objIot = {
                dev_name: `${comp_status.dev_name}.${comp_status.group_name}`,
                reg_name: comp_status.tag_name,
                reg_value: 1,
                ttl: 1
            }
            let resp = await query.insertDb(t_transmit, objIot)
            console.log(resp);
            return response.success(res, 'Success to turn OFF compressor')

        } catch (error) {
            console.log(error);
            response.failed(res, 'Failed to OFF compressor')
        }
    }
}