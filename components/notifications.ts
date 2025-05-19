import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export async function setupNotifications() {
	const { status } = await Notifications.requestPermissionsAsync();
	if (status !== "granted") return;

	await scheduleMidnightNotification();
	await scheduleEveningReminder();
}

async function scheduleMidnightNotification() {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "🎯 New Coding Challenge!",
			body: "Your next daily problem is unlocked. Let’s solve it!",
		},
		trigger: {
			hour: 0,
			minute: 0,
			repeats: true,
		},
	});
}

async function scheduleEveningReminder() {
	const today = new Date().toDateString();
	const doneMapStr = await AsyncStorage.getItem("doneMap");
	const doneMap = doneMapStr ? JSON.parse(doneMapStr) : {};
	const key = `1-${today}`; // Optional: Replace 1 with dynamic question id

	if (!doneMap[key]) {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "⏳ Complete your Challenge!",
				body: "You haven’t completed today's problem yet. Finish it before midnight!",
			},
			trigger: {
				hour: 20,
				minute: 0,
				repeats: true,
			},
		});
	}
}
