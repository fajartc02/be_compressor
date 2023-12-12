async function calculateParamsUpdate(arrParams, targetParamId) {
    const query = require('./queryModule')
    let containerParams = await query.customDb(`
        SELECT SUM(CAST(reg_value AS FLOAT)) as total from tb_m_parameters 
        WHERE tag_name IN (${arrParams.join(',')})`)
    const total = containerParams[0].total
    let respUpdateParamTarget = await query.updateDb('tb_m_parameters', {reg_value: total}, `client_hdl = '${targetParamId}'`)
    console.log(containerParams);
}

module.exports = calculateParamsUpdate