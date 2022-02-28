const activitiesModel = require('../models/activitySchema')

async function saveActivity(actionKey, fromFullName, type, actioned, fromImageUrl, toId, message, fromId) {
    try {
        
        
      var data = {
        "imageurl": fromImageUrl,
        "name": fromFullName,
        "type": type,
        "actionkey": actionKey,
        "actioned": actioned,
        'to': toId,
        'from': fromId,
        "message": message,
        "time": Date.now(),
      }
    
      const activity = new activitiesModel(data);
      await activity.save()
    } catch (error) {
      console.log("Error saving activity " + error)
    }
      return 1
    }
    
    module.exports = { saveActivity }