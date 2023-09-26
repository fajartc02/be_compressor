const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')
    // const idToUUID = require('../helpers/idToUUID')
const { tb_m_plants, tb_m_companies, tb_m_lines, tb_m_machines, v_mc_params } = require('../config/table')
const getLastId = require('../helpers/getLastId')


async function getLineMcs(plantId) {
    let lines = await query.readDb(tb_m_lines, 'uuid as line_id, line_snm', `plant_id = ${plantId}`)
    console.log('LINES BROOO');
    console.log(lines);
    if (lines.length > 0) {
        let machinesMap = await lines.map(async line => {
            console.log(line.line_id);
            line.machines = await query.readDb(v_mc_params, 'machine_id,machine_nm,x_axis,y_axis,reg_value as status', `line_id = '${line.line_id}'`)
            return line
        })
        let awaitMachineMap = await Promise.all(machinesMap)
        return awaitMachineMap
    }
    return []
}


module.exports = {
    insertDB: async(req, res) => {
        try {
            req.body.plant_id = await getLastId(tb_m_plants, 'plant_id')
            req.body.uuid = req.uuid
            req.body.background = 'uploads/' + req.file.path.split('uploads')[1]
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
            console.log(resp);
            let mapLine = await resp.map(async plant => {
                let plantId = await uuidToId(tb_m_plants, 'plant_id', plant.uuid)
                let linesMcs = await getLineMcs(plantId)
                plant.linesData = linesMcs
                return plant
            })
            let awaitLineMap = await Promise.all(mapLine)
            console.log(awaitLineMap);
            if (resp) response.success(res, 'success read plant', awaitLineMap)
        } catch (error) {
            console.log(error);
            response.failed(res, 'Error read plant')
        }
    },
    updateDB: async(req, res) => {
        try {
            console.log(req.file);
            // if (req.file) req.body.background = req.file.path
            if (req.file) req.body.background = 'uploads/' + req.file.path.split('uploads')[1]
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