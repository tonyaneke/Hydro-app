import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import storage from "@react-native-async-storage/async-storage";

import styles from "./styles";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [notification, setNotification] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const getPermission = async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Enable push notifications to use the app!");
          await storage.setItem("expopushtoken", "");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await storage.setItem("expopushtoken", token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    getPermission();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onStart = async () => {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Remember to drink water! 🥤",
        body: "Staying hydrated supports cardiovascular health by helping maintain adequate blood volume and circulation.",
      },
      trigger: {
        seconds: 60 * 1,
        repeats: true,
      },
    });
    setNotificationId(identifier);
  };
  const onStop = async () => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    Alert.alert("Notification stopped");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_TAWUXKH8hM-2kUsJDHFElA78H7NKSKIJqA&usqp=CAU",
        }}
        style={styles.image}
      />
      <Text style={styles.text}>
        Click button to set a 20 mins hydration reminder
      </Text>
      <TouchableOpacity onPress={onStart} style={styles.btn}>
        <Text
          style={{
            padding: 10,
            color: "white",
            fontWeight: "600",
            fontSize: 24,
          }}
        >
          START 🚀
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStop} style={styles.btn2}>
        <Text
          style={{
            padding: 10,
            color: "white",
            fontWeight: "600",
            fontSize: 24,
          }}
        >
          STOP❕
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
