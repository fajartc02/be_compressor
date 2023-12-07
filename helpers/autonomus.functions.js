async function schedulerAutonomusCheck() {
    const query = require('./queryModule')
    let resp = await query.customDb(`
            SELECT 
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
                tmcon.conjunction_desc
            FROM tb_m_formulas tmf
            JOIN tb_m_machines tmmc ON tmmc.machine_id = tmf.machine_id
            JOIN tb_m_parameters tmp ON tmp.client_hdl = tmf.param_id
            JOIN tb_m_operators tmop ON tmop.operator_id = tmf.operator_id
            LEFT JOIN tb_m_conjuntions tmcon ON tmcon.conjuntion_id = tmf.conjuntion_id
            LEFT JOIN tb_m_parameters tmpar ON tmpar.client_hdl = tmf.param_out_id
            ORDER BY conjunction_nm DESC
        `)
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
                children: item.children
            }
            containerGroup.push(obj)
            continue
        } else {
            machineAvail.children.push(item)
        }
    }
    for (let idx = 0; idx < containerGroup.length; idx++) {
        const itm = containerGroup[idx];
        if (itm.children.length > 1) {
            /* 
                itm.children[0].reg_value 
                itm.children[0].operator_nm 
                itm.children[0].limit_vals 

                itm.children[0].conjunction_nm 

                itm.children[1].reg_value
                itm.children[1].operator_nm
                itm.children[1].limit_vals
                
                Action:
                INSERT INTO t_transmit(dev_name, reg_name, reg_value, ttl, tr_time) VALUES ('${itm.children[1].out_devnm}.${itm.children[1].out_grpnm}', '${itm.children[1].out_tag}', '${itm.children[1].param_out_state}', '1', NOW())
            */
            const scriptTxt = `${ itm.children[0].reg_value.replace(',', '.') } ${itm.children[0].operator_nm} ${itm.children[0].limit_vals} ${itm.children[0].conjunction_nm} ${itm.children[1].reg_value.replace(',', '.')} ${itm.children[1].operator_nm} ${itm.children[1].limit_vals}`
            console.log(scriptTxt);
            console.log(eval(scriptTxt));
            if (eval(scriptTxt)) {
                let sqlQ = `
                    INSERT INTO t_transmit(dev_name, reg_name, reg_value, ttl, tr_time) VALUES ('${itm.children[1].out_devnm}.${itm.children[1].out_grpnm}', '${itm.children[1].out_tag}', '${itm.children[1].param_out_state}', '1', NOW())
                    ;
                    INSERT INTO tb_r_formula_log(msg, formula, action) VALUES ('success', '${scriptTxt}', 'SET ${itm.children[1].out_devnm}.${itm.children[1].out_grpnm}.${itm.children[1].out_tag} = ${itm.children[1].param_out_state}')`
                let resInst = query.customDb(sqlQ)
                console.log(`INSERT INTO t_transmit(dev_name, reg_name, reg_value, ttl, tr_time) VALUES ('${itm.children[1].out_devnm}.${itm.children[1].out_grpnm}', '${itm.children[1].out_tag}', '${itm.children[1].param_out_state}', '1', NOW())`);
            }
        } else {
            const scriptTxt2 = `${itm.children[0].reg_value.replace(',', '.') } ${itm.children[0].operator_nm} ${itm.children[0].limit_vals}`
            console.log(scriptTxt2);
            console.log(eval(scriptTxt2));
            if (eval(scriptTxt2)) {
                let sqlQ2 = `
                    INSERT INTO t_transmit(dev_name, reg_name, reg_value, ttl, tr_time) VALUES ('${itm.children[0].out_devnm}.${itm.children[0].out_grpnm}', '${itm.children[0].out_tag}', '${itm.children[0].param_out_state}', '1', NOW())
                    ;
                    INSERT INTO tb_r_formula_log(msg, formula, action) VALUES ('success', '${scriptTxt2}', 'SET ${itm.children[0].out_devnm}.${itm.children[0].out_grpnm}.${itm.children[0].out_tag} = ${itm.children[0].param_out_state}')`
                let resInst2 = query.customDb(sqlQ2)
                console.log(`INSERT INTO t_transmit(dev_name, reg_name, reg_value, ttl, tr_time) VALUES ('${itm.children[0].out_devnm}.${itm.children[0].out_grpnm}', '${itm.children[0].out_tag}', '${itm.children[0].param_out_state}', '1', NOW())`);
            }
        }
    }
    // console.log(containerGroup);
    return containerGroup
}

module.exports = schedulerAutonomusCheck