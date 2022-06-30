const express = require('express');
const router = express.Router();
const CollegeController = require("../controllers/collegeController")
const InternController = require("../controllers/internController")
const midValid = require("../middleware/validation")


// ---=+=---------=+=----------=+=----------- [ Route APIs ] ---=+=---------=+=----------=+=-----------//

router.post("/functionup/colleges", midValid.collegeValidation, CollegeController.createCollege)

router.post("/functionup/interns", midValid.internValidation, InternController.createIntern)

router.get("/functionup/collegeDetails", CollegeController.getCollegeDetails)


module.exports = router

// ---=+=---------=+=----------=+=----------- ****************** ---=+=---------=+=----------=+=-----------//