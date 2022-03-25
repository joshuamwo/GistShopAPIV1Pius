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


/**
 * Send notificatio with One signal
 * @param {String} userTokenList the list of user tokens.
 * @param {String} title The title of the notification.
 * @param {String} msg The message.
 * @param {String} screenA The screen to go to when you click.
 * @param {String} id The id of what to go to.
 */
async function sendNotificationOneSignal(userTokenList, title, msg, screenA, id) {
  console.log('Sending notif with One signal ' + userTokenList)
  var sendNotification = function (data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8"
    };

    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
      res.on('data', function (data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });

    req.on('error', function (e) {
      console.log("ERROR:");
      console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
  };

  var message = {
    app_id: process.env.ONE_SIGNAL_KEY,
    headings: { "en": title },
    contents: { "en": msg },
    data: { 'screen': screenA, 'id': id },
    include_player_ids: userTokenList
  };

  sendNotification(message);

}

module.exports = { saveActivity, sendNotificationOneSignal }