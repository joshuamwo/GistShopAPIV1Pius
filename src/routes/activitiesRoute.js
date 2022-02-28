const express = require('express')
const router = express.Router()
const activityController = require('../controllers/activity')

//Get all activities
router.get('/', activityController.getAllActivities)

//Get all activities after id
router.get('/last/activity', activityController.getAllActivitiesAfter)

//Get activities for user
router.get('/to/:uid', activityController.getUserActivities)

//Get activities for user After
router.get('/to/after/activity', activityController.getUserActivitiesAfter)

//Get activity by id
router.get('/:id', activityController.getActivityById)

//Get activity by type
router.get('/type/:type', activityController.getActivityByType)

//Save activity
router.post('/', activityController.saveActivity)

//Update activity
router.patch('/:id', activityController.updateActivity)

//Delete activity
router.delete('/:id', activityController.deleteActivity)

module.exports = router