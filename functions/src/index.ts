import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
//Notifications Function

exports.Notifications = functions.firestore
    .document('notifications/{push}')
    .onUpdate(async event => {
    const data = event.after.data();

    var payload ={
        notification: {
        title: data.title,
        body: data.message,
        image: ''
        }
    }


   

    // ref to the device collection for the user
    const db = admin.firestore()
    const devicesRef = db.collection('devices')


    // get the user's tokens and send notifications
    const devices = await devicesRef.get();

    const tokens = [];

    // send a notification to each device token
    devices.forEach(result => {
      const token = result.data().token;

      tokens.push( token )
    })
    return admin.messaging().sendToDevice(tokens, payload)
    });