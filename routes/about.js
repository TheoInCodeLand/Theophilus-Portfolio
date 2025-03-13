const express = require('express');
const router = express();

router.get('/', (req, res)=>{
    res.send('About page!')
});

module.exports = router;