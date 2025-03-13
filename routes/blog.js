const express = require('express');
const router = express();

router.get('/', (req, res)=>{
    res.send('Blogs page!')
})

module.exports = router;