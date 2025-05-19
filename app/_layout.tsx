import { Slot } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DrawerLayout from "../components/DrawerLayout";
import { setupNotifications } from "../components/notifications";

export default function RootLayout() {
	useEffect(() => {
		setupNotifications();
	}, []);

	return (
		<SafeAreaProvider>
			<DrawerLayout>
				<Slot />
			</DrawerLayout>
		</SafeAreaProvider>
	);
}
