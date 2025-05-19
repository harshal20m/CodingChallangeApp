import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const ContactDev = () => {
	// Animation values
	const fadeIn = useRef(new Animated.Value(0)).current;
	const titleScale = useRef(new Animated.Value(0.8)).current;
	const buttonTranslateY = useRef(new Animated.ValueXY({ x: 0, y: 50 })).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const bounceAnim = useRef(new Animated.Value(0)).current;

	const contactOptions = [
		{
			name: "WhatsApp",
			icon: "logo-whatsapp",
			color: ["#25D366", "#128C7E"],
			url: "https://wa.me/918669119880",
			lottie: require("../../assets/animations/whatsapp.json"),
		},
		{
			name: "LinkedIn",
			icon: "logo-linkedin",
			color: ["#0077B5", "#0e4f77"],
			url: "https://www.linkedin.com/in/harshal-mali-b40b61244/",
			lottie: require("../../assets/animations/linkedin.json"),
		},
		{
			name: "Gmail",
			icon: "envelope",
			color: ["#EA4335", "#B31412"],
			url: "mailto:20harshalmali@gmail.com",
			lottie: require("../../assets/animations/email.json"),
		},
	];

	// Run animations on component mount
	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeIn, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.spring(titleScale, {
				toValue: 1,
				friction: 4,
				tension: 40,
				useNativeDriver: true,
			}),
			Animated.spring(buttonTranslateY, {
				toValue: { x: 0, y: 0 },
				friction: 6,
				tension: 40,
				useNativeDriver: true,
			}),
			Animated.loop(
				Animated.sequence([
					Animated.timing(rotateAnim, {
						toValue: 1,
						duration: 2000,
						easing: Easing.linear,
						useNativeDriver: true,
					}),
					Animated.timing(rotateAnim, {
						toValue: 0,
						duration: 2000,
						easing: Easing.linear,
						useNativeDriver: true,
					}),
				])
			),
			Animated.loop(
				Animated.sequence([
					Animated.timing(bounceAnim, {
						toValue: 1,
						duration: 1500,
						easing: Easing.bounce,
						useNativeDriver: true,
					}),
					Animated.timing(bounceAnim, {
						toValue: 0,
						duration: 1500,
						easing: Easing.bounce,
						useNativeDriver: true,
					}),
				])
			),
		]).start();
	}, []);

	// Calculate the rotate animation
	const spin = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "15deg"],
	});

	// Calculate the bounce animation
	const bounce = bounceAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -15],
	});

	// Function to handle button press with haptic feedback
	const handleContactPress = (url) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		Linking.openURL(url);
	};

	// Function to render staggered buttons with delay
	const renderButtons = () => {
		return contactOptions.map((option, index) => {
			const buttonAnim = useRef(new Animated.Value(width)).current;

			useEffect(() => {
				Animated.spring(buttonAnim, {
					toValue: 0,
					friction: 6,
					tension: 40,
					delay: 300 + index * 200,
					useNativeDriver: true,
				}).start();
			}, []);

			return (
				<Animated.View
					key={index}
					style={[
						styles.buttonContainer,
						{
							transform: [{ translateX: buttonAnim }, { translateY: buttonTranslateY.y }],
							opacity: fadeIn,
						},
					]}
				>
					<TouchableOpacity
						style={[styles.contactButton]}
						onPress={() => handleContactPress(option.url)}
						activeOpacity={0.8}
					>
						<LinearGradient
							colors={option.color}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.gradient}
						>
							<View style={styles.iconContainer}>
								{option.icon.startsWith("logo") ? (
									<Ionicons name={option.icon} size={24} color="#fff" />
								) : (
									<FontAwesome name={option.icon} size={24} color="#fff" />
								)}
							</View>
							<Text style={styles.contactText}>{option.name}</Text>

							<View style={styles.animIndicator}>
								<LottieView source={option.lottie} autoPlay loop style={{ width: 40, height: 40 }} />
							</View>
						</LinearGradient>
					</TouchableOpacity>
				</Animated.View>
			);
		});
	};

	return (
		<LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
			<View style={styles.overlay}>
				<LottieView
					source={require("../../assets/animations/background-waves.json")}
					autoPlay
					loop
					style={styles.backgroundAnimation}
					resizeMode="cover"
				/>

				<Animated.View
					style={[
						styles.headerContainer,
						{
							opacity: fadeIn,
							transform: [{ scale: titleScale }, { translateY: bounce }, { rotate: spin }],
						},
					]}
				>
					<LottieView
						source={require("../../assets/animations/phone-call.json")}
						autoPlay
						loop
						style={styles.phoneAnimation}
					/>
				</Animated.View>
				<Text style={styles.title}>Contact Developer</Text>
				<Text style={styles.subtitle}>Feel free to raise your query!</Text>

				<View style={styles.buttonsContainer}>{renderButtons()}</View>

				<Animated.View style={[styles.footerContainer, { opacity: fadeIn }]}>
					<LottieView
						source={require("../../assets/animations/loading-dots.json")}
						autoPlay
						loop
						style={styles.loadingAnimation}
					/>
					<Text style={styles.footerText}>Will respond within 24 hours</Text>
				</Animated.View>
			</View>
		</LinearGradient>
	);
};

export default ContactDev;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	backgroundAnimation: {
		position: "absolute",
		width: "100%",
		height: "100%",
		opacity: 0.6,
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: 40,
	},
	phoneAnimation: {
		width: 120,
		height: 120,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 6,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 5,
	},
	subtitle: {
		fontSize: 18,
		color: "#e0e0e0",
		marginBottom: 20,
		fontStyle: "italic",
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	buttonsContainer: {
		width: "100%",
		alignItems: "center",
	},
	buttonContainer: {
		width: "90%",
		marginVertical: 10,
	},
	contactButton: {
		borderRadius: 16,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 6,
	},
	gradient: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 16,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
	},
	contactText: {
		flex: 1,
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
		marginLeft: 15,
	},
	animIndicator: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	footerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 40,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 30,
	},
	loadingAnimation: {
		width: 40,
		height: 20,
	},
	footerText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
});
