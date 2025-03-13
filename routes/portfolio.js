const express = require('express');
const router = express();

router.get('/', (req, res)=>{
    res.send('Porfolio page!')
})

module.exports = router;