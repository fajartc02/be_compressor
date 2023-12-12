const response = require('../helpers/response')
const query = require('../helpers/queryModule')
const uuidToId = require('../helpers/UUIDtoID')

const { tb_m_formulas, tb_m_machines, tb_m_parameters, tb_m_operators, tb_m_conjuntions, tb_m_main_formula } = require('../config/table')
const getLastId = require('../helpers/getLastId')
const { v4 } = require('uuid')


module.exports = {
    readDb: async(req, res) => {
        try {
            let resp = await query.customDb(`
                SELECT 
                    ROW_NUMBER() OVER(PARTITION BY formula_nm) as no,
                    tmmf.main_formula_id,
                    tmmf.formula_nm,
                    tmf.uuid as formula_id,
                    tmf.param_out_state,
                    tmf.param_out_id,
                    tmf.limit_vals,
                    tmpar.client_hdl as out_hdl,
                    tmpar.dev_name as out_devnm,
                    tmpar.group_name as out_grpnm,
                    tmpar.tag_name as out_tag,
                    tmpar.reg_value as out_regval,
                    tmp.client_hdl,
                    tmp.dev_name,
                    tmp.group_name,
                    tmp.tag_name,
                    tmp.reg_value,
                    tmmc.uuid as machine_id,
                    tmmc.machine_nm,
                    tmop.operator_nm,
                    tmop.operator_desc,
                    tmcon.uuid as conjuntion_id,
                    tmcon.conjunction_nm,
                    tmcon.conjunction_desc,
                    tmmf.is_active
                FROM tb_m_main_formula tmmf
                JOIN tb_m_formulas tmf ON tmmf.main_formula_id = tmf.main_formula_id
                JOIN tb_m_machines tmmc ON tmmc.machine_id = tmf.machine_id
                JOIN tb_m_parameters tmp ON tmp.client_hdl = tmf.param_id
                JOIN tb_m_operators tmop ON tmop.operator_id = tmf.operator_id
                LEFT JOIN tb_m_conjuntions tmcon ON tmcon.conjuntion_id = tmf.conjuntion_id
                LEFT JOIN tb_m_parameters tmpar ON tmpar.client_hdl = tmf.param_out_id
                ORDER BY tmmf.created_at ASC
            `)
            console.log(resp);
            let containerGroup = []
            for (let i = 0; i < resp.length; i++) {
                const item = resp[i];
                let machineAvail = containerGroup.find(child => child.main_formula_id === item.main_formula_id)
                if (!machineAvail) {
                    item.children = []
                    item.children.push(JSON.parse(JSON.stringify(item)))
                        // item.no = i + 1
                    const obj = {
                        no: i + 1,
                        main_formula_id: item.main_formula_id,
                        formula_nm: item.formula_nm, 
                        machine_nm: item.machine_nm,
                        is_active: item.is_active ? true : false,
                        children: item.children
                    }
                    containerGroup.push(obj)
                    continue
                } else {
                    machineAvail.children.push(item)
                }
            }
            response.success(res, 'Success to get formulas', containerGroup)
        } catch (error) {
            console.error(error)
            response.error(res, 'Failed to get formulas')
        }
    },
    insertDb: async(req, res) => {
        try {
            let { formula_nm, containerFormulas } = req.body
            const formulaRes = await query.insertDb(tb_m_main_formula, {formula_nm})
            const main_formula_id = formulaRes.insertId
            let convFormula = await containerFormulas.map(async item => {
                item.machine_id ? item.machine_id = await uuidToId(tb_m_machines, 'machine_id', item.machine_id.machine_id) : item.machine_id = null
                item.operator_id ? item.operator_id = await uuidToId(tb_m_operators, 'operator_id', item.operator_id.operator_id) : item.operator_id = null
                item.conjuntion_id ? item.conjuntion_id = await uuidToId(tb_m_conjuntions, 'conjuntion_id', item.conjuntion_id.conjuntion_id) : item.conjuntion_id = null
                return {
                    main_formula_id,
                    machine_id: item.machine_id,
                    uuid: v4(),
                    param_id: item.param_id.client_hdl,
                    operator_id: item.operator_id,
                    conjuntion_id: item.conjuntion_id,
                    param_out_id: item.param_out_id?.client_hdl,
                    limit_vals: item.limit_vals,
                    param_out_state: item.param_out_state
                }
            })
            let waitConvFormula = await Promise.all(convFormula)
                // console.log(waitConvFormula);
            const respInst = await query.insertBulkDb(tb_m_formulas, waitConvFormula)
            response.success(res, 'Success to insert formula', respInst)
        } catch (error) {
            console.error(error)
            response.error(res, 'Failed to insert formulas')
        }
    }
}