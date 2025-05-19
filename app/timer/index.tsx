import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TimerScreen() {
	// Timer/Stopwatch state
	const [isRunning, setIsRunning] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [timerHistory, setTimerHistory] = useState([]);
	const [activeTab, setActiveTab] = useState("stopwatch"); // 'stopwatch' or 'timer'
	const [selectedPreset, setSelectedPreset] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Timer mode specific state
	const [timerDuration, setTimerDuration] = useState(1800); // 30 minutes by default
	const [remainingTime, setRemainingTime] = useState(timerDuration);
	const [isTimerComplete, setIsTimerComplete] = useState(false);

	// Session state
	const [sessionName, setSessionName] = useState("Coding Question");
	const [currentLap, setCurrentLap] = useState(0);

	// References
	const intervalRef = useRef(null);

	// Storage key
	const STORAGE_KEY = "@coding_timer_history";

	// Timer presets (in seconds)
	const timerPresets = [
		{ id: 1, name: "5 minutes", duration: 5 * 60 },
		{ id: 2, name: "10 minutes", duration: 10 * 60 },
		{ id: 3, name: "15 minutes", duration: 15 * 60 },
		{ id: 4, name: "15 minutes", duration: 15 * 60 },
		{ id: 5, name: "30 minutes", duration: 30 * 60 },
		{ id: 6, name: "45 minutes", duration: 45 * 60 },
		{ id: 7, name: "1 hour", duration: 60 * 60 },
	];

	// Load saved timer history from AsyncStorage
	useEffect(() => {
		const loadTimerHistory = async () => {
			try {
				const savedHistory = await AsyncStorage.getItem(STORAGE_KEY);
				if (savedHistory !== null) {
					setTimerHistory(JSON.parse(savedHistory));
				}
			} catch (error) {
				console.error("Error loading timer history:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadTimerHistory();
	}, []);

	// Save timer history to AsyncStorage whenever it changes
	useEffect(() => {
		const saveTimerHistory = async () => {
			try {
				if (!isLoading) {
					await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timerHistory));
				}
			} catch (error) {
				console.error("Error saving timer history:", error);
			}
		};

		saveTimerHistory();
	}, [timerHistory, isLoading]);

	// Handle timer/stopwatch logic
	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				if (activeTab === "stopwatch") {
					setElapsedTime((prev) => prev + 1);
				} else {
					setRemainingTime((prev) => {
						if (prev <= 1) {
							clearInterval(intervalRef.current);
							setIsRunning(false);
							setIsTimerComplete(true);
							return 0;
						}
						return prev - 1;
					});
				}
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// Cleanup interval on unmount
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, activeTab]);

	// Format time (seconds) to display as HH:MM:SS
	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		return [
			hours.toString().padStart(2, "0"),
			minutes.toString().padStart(2, "0"),
			secs.toString().padStart(2, "0"),
		].join(":");
	};

	// Start/pause the timer
	const toggleTimer = () => {
		if (isTimerComplete && activeTab === "timer") {
			resetTimer();
			return;
		}
		setIsRunning(!isRunning);
	};

	// Reset timer/stopwatch
	const resetTimer = () => {
		setIsRunning(false);

		if (activeTab === "stopwatch") {
			if (elapsedTime > 0) {
				saveSession();
			}
			setElapsedTime(0);
			setCurrentLap(0);
		} else {
			setRemainingTime(timerDuration);
			setIsTimerComplete(false);
		}
	};

	// Record lap time
	const recordLap = () => {
		if (isRunning && activeTab === "stopwatch") {
			setCurrentLap(currentLap + 1);
		}
	};

	// Save completed session to history
	const saveSession = () => {
		const newSession = {
			id: Date.now().toString(),
			name: sessionName,
			duration: elapsedTime,
			type: activeTab,
			timestamp: new Date().toLocaleString(),
			laps: currentLap,
		};

		setTimerHistory([newSession, ...timerHistory]);
	};

	// Select timer preset
	const selectPreset = (preset) => {
		setSelectedPreset(preset.id);
		setTimerDuration(preset.duration);
		setRemainingTime(preset.duration);
		setIsTimerComplete(false);
	};

	// Delete history item
	const deleteHistoryItem = (id) => {
		Alert.alert("Delete Session", "Are you sure you want to delete this session?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				onPress: () => {
					const updatedHistory = timerHistory.filter((item) => item.id !== id);
					setTimerHistory(updatedHistory);
					// No need to explicitly save to AsyncStorage here as the useEffect will handle it
				},
				style: "destructive",
			},
		]);
	};

	// Clear all history
	const clearAllHistory = () => {
		Alert.alert(
			"Clear All History",
			"Are you sure you want to delete all session history? This cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Clear All",
					onPress: async () => {
						try {
							await AsyncStorage.removeItem(STORAGE_KEY);
							setTimerHistory([]);
						} catch (error) {
							console.error("Error clearing timer history:", error);
						}
					},
					style: "destructive",
				},
			]
		);
	};

	// Render each history item
	const renderHistoryItem = ({ item }) => (
		<View style={styles.historyItem}>
			<View style={styles.historyItemContent}>
				<Text style={styles.historyItemName}>{item.name}</Text>
				<Text style={styles.historyItemTime}>
					{formatTime(item.duration)}
					{item.laps > 0 && ` • ${item.laps} laps`}
				</Text>
				<Text style={styles.historyItemDate}>{item.timestamp}</Text>
			</View>
			<TouchableOpacity style={styles.deleteButton} onPress={() => deleteHistoryItem(item.id)}>
				<Ionicons name="trash-outline" size={18} color="#ff3b30" />
			</TouchableOpacity>
		</View>
	);

	// Main timer display (either countdown or stopwatch)
	const renderTimerDisplay = () => {
		const timeToShow = activeTab === "stopwatch" ? elapsedTime : remainingTime;
		const timeString = formatTime(timeToShow);

		const displayColor = isTimerComplete ? "#ff3b30" : isRunning ? "#3066BE" : "#333";

		return (
			<View style={styles.timerDisplayContainer}>
				<Text style={[styles.timerDisplay, { color: displayColor }]}>{timeString}</Text>

				{currentLap > 0 && activeTab === "stopwatch" && (
					<Text style={styles.lapCounter}>Laps: {currentLap}</Text>
				)}

				{isTimerComplete && <Text style={styles.completeText}>Time's up!</Text>}
			</View>
		);
	};

	// Render tabs for switching between stopwatch and timer
	const renderTabs = () => (
		<View style={styles.tabContainer}>
			<TouchableOpacity
				style={[styles.tab, activeTab === "stopwatch" && styles.activeTab]}
				onPress={() => {
					if (activeTab !== "stopwatch") {
						setIsRunning(false);
						setActiveTab("stopwatch");
					}
				}}
			>
				<Ionicons name="stopwatch-outline" size={20} color={activeTab === "stopwatch" ? "#3066BE" : "#666"} />
				<Text style={[styles.tabText, activeTab === "stopwatch" && styles.activeTabText]}>Stopwatch</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.tab, activeTab === "timer" && styles.activeTab]}
				onPress={() => {
					if (activeTab !== "timer") {
						setIsRunning(false);
						setActiveTab("timer");
					}
				}}
			>
				<Ionicons name="timer-outline" size={20} color={activeTab === "timer" ? "#3066BE" : "#666"} />
				<Text style={[styles.tabText, activeTab === "timer" && styles.activeTabText]}>Timer</Text>
			</TouchableOpacity>
		</View>
	);

	// Timer presets for countdown mode
	const renderTimerPresets = () => {
		if (activeTab !== "timer") return null;

		return (
			<View style={styles.presetsContainer}>
				<Text style={styles.presetsTitle}>Timer Presets</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetList}>
					{timerPresets.map((preset) => (
						<TouchableOpacity
							key={preset.id}
							style={[styles.presetItem, selectedPreset === preset.id && styles.selectedPreset]}
							onPress={() => selectPreset(preset)}
						>
							<Text
								style={[styles.presetText, selectedPreset === preset.id && styles.selectedPresetText]}
							>
								{preset.name}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Coding Timer</Text>

			{/* Tab Switcher */}
			{renderTabs()}

			{/* Timer Display */}
			{renderTimerDisplay()}

			{/* Timer Presets */}
			{renderTimerPresets()}

			{/* Control Buttons */}
			<View style={styles.controlsContainer}>
				<TouchableOpacity style={[styles.controlButton, styles.resetButton]} onPress={resetTimer}>
					<Ionicons name="refresh" size={24} color="#666" />
					<Text style={styles.buttonText}>Reset</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.controlButton,
						styles.mainButton,
						isRunning ? styles.pauseButton : styles.startButton,
						isTimerComplete && styles.resetCompleteButton,
					]}
					onPress={toggleTimer}
				>
					<Ionicons
						name={isTimerComplete ? "refresh" : isRunning ? "pause" : "play"}
						size={28}
						color="white"
					/>
					<Text style={styles.mainButtonText}>
						{isTimerComplete ? "Restart" : isRunning ? "Pause" : "Start"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.controlButton,
						styles.lapButton,
						!(isRunning && activeTab === "stopwatch") && styles.disabledButton,
					]}
					onPress={recordLap}
					disabled={!(isRunning && activeTab === "stopwatch")}
				>
					<Ionicons
						name="flag"
						size={24}
						color={isRunning && activeTab === "stopwatch" ? "#3066BE" : "#ccc"}
					/>
					<Text style={[styles.buttonText, !(isRunning && activeTab === "stopwatch") && styles.disabledText]}>
						Lap
					</Text>
				</TouchableOpacity>
			</View>

			{/* Session History */}
			<View style={styles.historyContainer}>
				<View style={styles.historyHeader}>
					<Text style={styles.historyTitle}>Session History</Text>
					{timerHistory.length > 0 && (
						<TouchableOpacity style={styles.clearAllButton} onPress={clearAllHistory}>
							<Text style={styles.clearAllText}>Clear All</Text>
						</TouchableOpacity>
					)}
				</View>

				{isLoading ? (
					<View style={styles.emptyHistory}>
						<Text style={styles.loadingText}>Loading session history...</Text>
					</View>
				) : timerHistory.length === 0 ? (
					<View style={styles.emptyHistory}>
						<Ionicons name="time-outline" size={48} color="#ccc" />
						<Text style={styles.emptyHistoryText}>No sessions recorded yet</Text>
					</View>
				) : (
					<FlatList
						data={timerHistory}
						renderItem={renderHistoryItem}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.historyList}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f8f9fb",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	// Tab Styles
	tabContainer: {
		flexDirection: "row",
		marginBottom: 20,
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
	},
	tab: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		backgroundColor: "#f8f9fb",
	},
	activeTab: {
		backgroundColor: "#fff",
		borderBottomWidth: 2,
		borderBottomColor: "#3066BE",
	},
	tabText: {
		fontSize: 16,
		marginLeft: 8,
		color: "#666",
		fontWeight: "500",
	},
	activeTabText: {
		color: "#3066BE",
		fontWeight: "bold",
	},
	// Timer Display Styles
	timerDisplayContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 24,
		alignItems: "center",
		marginBottom: 20,
		elevation: 2,
	},
	timerDisplay: {
		fontSize: 48,
		fontWeight: "bold",
		fontVariant: ["tabular-nums"],
		color: "#333",
	},
	lapCounter: {
		fontSize: 18,
		color: "#666",
		marginTop: 8,
	},
	completeText: {
		fontSize: 20,
		color: "#ff3b30",
		fontWeight: "bold",
		marginTop: 12,
	},
	// Preset Styles
	presetsContainer: {
		marginBottom: 20,
	},
	presetsTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#555",
		marginBottom: 8,
	},
	presetList: {
		paddingVertical: 4,
	},
	presetItem: {
		backgroundColor: "#fff",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		marginRight: 10,
		elevation: 1,
		borderWidth: 1,
		borderColor: "#eaeaea",
	},
	selectedPreset: {
		backgroundColor: "#3066BE",
		borderColor: "#3066BE",
	},
	presetText: {
		color: "#555",
		fontWeight: "500",
	},
	selectedPresetText: {
		color: "#fff",
	},
	// Controls Styles
	controlsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	controlButton: {
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderRadius: 12,
	},
	mainButton: {
		backgroundColor: "#3066BE",
		paddingHorizontal: 30,
		paddingVertical: 16,
		elevation: 3,
	},
	startButton: {
		backgroundColor: "#3066BE",
	},
	pauseButton: {
		backgroundColor: "#ff9500",
	},
	resetCompleteButton: {
		backgroundColor: "#ff3b30",
	},
	resetButton: {
		backgroundColor: "#f0f0f0",
	},
	lapButton: {
		backgroundColor: "#f0f0f0",
	},
	disabledButton: {
		opacity: 0.5,
	},
	buttonText: {
		fontSize: 14,
		color: "#555",
		marginTop: 4,
	},
	mainButtonText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "bold",
		marginTop: 4,
	},
	disabledText: {
		color: "#aaa",
	},
	// History Styles
	historyContainer: {
		flex: 1,
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	historyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	clearAllButton: {
		paddingVertical: 4,
		paddingHorizontal: 10,
		backgroundColor: "#f8f9fb",
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#ff3b30",
	},
	clearAllText: {
		fontSize: 12,
		color: "#ff3b30",
		fontWeight: "500",
	},
	historyList: {
		paddingBottom: 20,
	},
	historyItem: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 10,
		marginBottom: 10,
		elevation: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	historyItemContent: {
		flex: 1,
	},
	historyItemName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	historyItemTime: {
		fontSize: 15,
		color: "#3066BE",
		fontWeight: "500",
		marginTop: 4,
	},
	historyItemDate: {
		fontSize: 12,
		color: "#888",
		marginTop: 4,
	},
	deleteButton: {
		padding: 8,
	},
	emptyHistory: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	emptyHistoryText: {
		marginTop: 12,
		fontSize: 16,
		color: "#888",
		textAlign: "center",
	},
	loadingText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});
