const express = require('express');
const externalModul = require('../logger/logger')
const externalModule=require('../util/helper')
const externalModules = require('../validator/formater')
const prb=require('../prb4/prb4')
const router = express.Router();

router.get('/test-me', function (req, res) {
    
    externalModul.welcome()
         externalModule.printDate()
         externalModule.getCurrentMonth()
         externalModule.getCohortData()
    externalModule.case1q
    externalModule.case2
    externalModule.case3
   

    res.send('My first ever api!')
});
router.get('/hello', function (req, res){

prb.months
prb.number
prb.object
prb.Router



    res.send('My node js api')

})



module.exports = router;
// adding this comment for no reason