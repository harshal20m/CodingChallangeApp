import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { DrawerLayoutAndroid, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DrawerLayout({ children }: { children: React.ReactNode }) {
	const drawer = useRef<DrawerLayoutAndroid>(null);
	const [modalVisible, setModalVisible] = useState(false);

	const menuItems = [
		{ title: "Home", icon: "home", route: "/" },
		{ title: "Questions", icon: "code-slash", route: "/questions" },
		{ title: "Notes", icon: "document-text", route: "/notes" },
		{ title: "Timers ", icon: "watch", route: "/timer" },
		{ title: "About Us", icon: "information", route: "/queries" },
	];

	const navigationView = () => (
		<View style={styles.drawerContainer}>
			<View style={styles.drawerHeader}>
				<View style={styles.logoContainer}>
					<Text style={styles.logoText}>CC</Text>
				</View>
				<Text style={styles.drawerTitle}>Coding Challenge</Text>
				<Text style={styles.drawerSubtitle}>Learn, Practice, DSA</Text>
			</View>

			<View style={styles.menuContainer}>
				{menuItems.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.menuItem}
						onPress={() => {
							router.push(item.route);
							drawer.current?.closeDrawer();
						}}
					>
						<Ionicons name={item.icon} size={22} color="#3066BE" />
						<Text style={styles.menuText}>{item.title}</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.drawerFooter}>
				<Text style={styles.footerText}>
					Made with 💖 by {"<"}HM{">"}
				</Text>
			</View>
		</View>
	);

	return (
		<DrawerLayoutAndroid
			ref={drawer}
			drawerWidth={280}
			drawerPosition="left"
			renderNavigationView={navigationView}
			drawerBackgroundColor="#f8f9fb"
		>
			<StatusBar backgroundColor="#2459a8" barStyle="light-content" />
			<View style={styles.mainContainer}>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<TouchableOpacity
							style={styles.menuButton}
							onPress={() => drawer.current?.openDrawer()}
							activeOpacity={0.7}
						>
							<Ionicons name="menu" size={26} color="white" />
						</TouchableOpacity>
						<Text style={styles.title}>Coding Challenge</Text>
					</View>

					<TouchableOpacity
						onPress={() => setModalVisible(true)}
						style={styles.infoButton}
						activeOpacity={0.7}
					>
						<Ionicons name="information-circle" size={26} color="white" />
					</TouchableOpacity>
				</View>

				<View style={styles.contentContainer}>{children}</View>

				<Modal
					animationType="fade"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => setModalVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Reminder</Text>
								<TouchableOpacity onPress={() => setModalVisible(false)}>
									<Ionicons name="close" size={24} color="#666" />
								</TouchableOpacity>
							</View>

							<Text style={styles.modalText}>
								Ajj Padhega to kal Accha package lekar jayenga , apni mehnat par bharosa rkh time pass
								to badme bhi kara jayenga , aaa merii jaan....
							</Text>

							<TouchableOpacity
								style={styles.okButton}
								onPress={() => setModalVisible(false)}
								activeOpacity={0.8}
							>
								<Text style={styles.okText}>OK Bhai</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		</DrawerLayoutAndroid>
	);
}

const styles = StyleSheet.create({
	drawerContainer: {
		flex: 1,
		backgroundColor: "#f8f9fb",
	},
	drawerHeader: {
		backgroundColor: "#3066BE",
		paddingTop: 40,
		paddingBottom: 20,
		paddingHorizontal: 20,
		alignItems: "center",
	},
	logoContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
		elevation: 4,
	},
	logoText: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#3066BE",
	},
	drawerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		marginBottom: 4,
	},
	drawerSubtitle: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.8)",
	},
	menuContainer: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 12,
	},
	gif: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 }, // Styling for GIF
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
		marginVertical: 4,
		borderRadius: 8,
		backgroundColor: "white",
		elevation: 2,
	},
	menuText: {
		fontSize: 16,
		color: "#333",
		fontWeight: "500",
		marginLeft: 12,
	},
	drawerFooter: {
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#eaeaea",
		alignItems: "center",
	},
	footerText: {
		color: "#888",
		fontSize: 12,
	},
	mainContainer: {
		flex: 1,
		backgroundColor: "#f5f5f7",
	},
	header: {
		height: 64,
		backgroundColor: "#3066BE",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		elevation: 4,
		paddingTop: 8,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
	},
	menuButton: {
		padding: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
		marginLeft: 12,
	},
	infoButton: {
		padding: 8,
		borderRadius: 20,
	},
	contentContainer: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
	},
	modalContent: {
		width: "85%",
		backgroundColor: "white",
		borderRadius: 12,
		overflow: "hidden",
		elevation: 8,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eaeaea",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	modalText: {
		fontSize: 16,
		color: "#444",
		lineHeight: 24,
		textAlign: "center",
		paddingVertical: 24,
		paddingHorizontal: 16,
	},
	okButton: {
		backgroundColor: "#3066BE",
		borderRadius: 8,
		margin: 16,
		paddingVertical: 12,
		alignItems: "center",
		elevation: 2,
	},
	okText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
