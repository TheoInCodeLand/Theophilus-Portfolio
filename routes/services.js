const express = require('express');
const router = express();

router.get('/', (req, res)=>{
    res.send('Services page!')
});

module.exports = router;