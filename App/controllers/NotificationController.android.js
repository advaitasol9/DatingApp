import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const NotificationController = props => {
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'com.chanceapp.android', // (required)
        channelName: 'Chance app', // (required)
        // channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteNotification', remoteMessage);
      PushNotification.localNotification({
        channelId: 'com.chanceapp.android',
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
        smallIcon: 'ic_notification',
        color: '#15f4ee',
      });
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
