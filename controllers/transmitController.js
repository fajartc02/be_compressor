module.exports = {
    transmit: async(req, res) => {
        // let q = `INSERT INTO t_transmit(DEV_NAME, REG_NAME, REG_VALUE, TTL) VALUES ('Device1.G1', 'COMP_ON', '0', '1')`
        await cmdMultipleQuery(q)
            .then((result) => {
                console.log(result);
                res.status(201).json({
                    message: 'ok',
                    result
                })
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    message: 'err',
                    err
                })
            });
    },
}