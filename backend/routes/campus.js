const express = require('express');
const router = express.Router();
//const classController = require('../controllers/classController');
//const bookingController = require('../controllers/bookingController');
const campusController = require('../controllers/campusController');
//import { campusData } from '../../data/campusData'; // Static campus data
//import { get } from '../models/Exercise';

//====CAMPUS ROUTES====//

//General campus routes (student and admin)
router.get('/all', campusController.getAllCampuses); //get all campuses
router.get('/:campusId', campusController.getCampusById); //get campus by ID
router.get('/:campusId/schedule', campusController.getCampusSchedule); //get campus schedule

module.exports = router;