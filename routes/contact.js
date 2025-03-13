const express = require('express');
const router = express();

router.get('/', (req, res)=>{
    res.send('Contacts page!')
})

module.exports = router;