var express = require('express');
var router = express.Router();
const auth = require('./auth/index')
const master = require('./master/index')
const iot = require('./iot/index')
const fs = require('fs')
const stream = require('stream')

router.use('/', auth)
router.use('/master', master)
router.use('/iot', iot)
router.get('/image', async(req, res) => {
    let pathImage = `${req.query.path}`
    const r = fs.createReadStream(pathImage) // or any other way to get a readable stream
    const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
    stream.pipeline(
        r,
        ps, // <---- this makes a trick with stream error handling
        (err) => {
            if (err) {
                console.log(err) // No such file or any other kind of error
                return res.sendStatus(400);
            }
        })
    ps.pipe(res) // <---- this makes a trick with stream error handling
});

module.exports = router;