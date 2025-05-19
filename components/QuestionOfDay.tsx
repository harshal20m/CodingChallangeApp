import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import questions from "../data/questions";

function getTodayIndex() {
	const startDate = new Date(2025, 0, 1); // Jan 1, 2025
	const today = new Date();
	const diffTime = today.getTime() - startDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return diffDays % questions.length; // cycle questions daily
}

// Format seconds as HH:mm:ss
function formatTime(seconds: number) {
	const hrs = Math.floor(seconds / 3600)
		.toString()
		.padStart(2, "0");
	const mins = Math.floor((seconds % 3600) / 60)
		.toString()
		.padStart(2, "0");
	const secs = (seconds % 60).toString().padStart(2, "0");
	return `${hrs}:${mins}:${secs}`;
}

// Format date to display as "Mon, May 17"
function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function QuestionOfDay() {
	const [todayIndex, setTodayIndex] = useState(getTodayIndex());
	const todayQuestion = questions[todayIndex];
	const [doneMap, setDoneMap] = useState<{ [key: string]: boolean }>({});
	const [secondsLeft, setSecondsLeft] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedQuestion, setSelectedQuestion] = useState<null | {
		question: typeof todayQuestion;
		dateStr: string;
	}>(null);
	const [showPendingModal, setShowPendingModal] = useState(false);

	useEffect(() => {
		// Load done statuses
		async function loadDone() {
			try {
				setIsLoading(true);
				const stored = await AsyncStorage.getItem("doneMap");
				if (stored) setDoneMap(JSON.parse(stored));
				setIsLoading(false);
			} catch (e) {
				console.error("Failed to load done status", e);
				setIsLoading(false);
			}
		}
		loadDone();

		// Setup countdown timer
		const updateTimer = () => {
			const now = new Date();
			const tomorrow = new Date(now);
			tomorrow.setHours(24, 0, 0, 0); // midnight next day
			const diff = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
			setSecondsLeft(diff);
		};

		updateTimer();
		const intervalId = setInterval(() => {
			setSecondsLeft((prev) => {
				if (prev <= 1) {
					setTodayIndex(getTodayIndex()); // update question at midnight
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	// Toggle done for today's question
	const toggleDone = async () => {
		const key = `${todayQuestion.id}-${new Date().toDateString()}`;
		const newDoneMap = { ...doneMap, [key]: !doneMap[key] };
		setDoneMap(newDoneMap);
		await AsyncStorage.setItem("doneMap", JSON.stringify(newDoneMap));
	};

	// Toggle done for any question/date (including previous)
	const toggleDoneSelected = async () => {
		if (!selectedQuestion) return;
		const { question, dateStr } = selectedQuestion;
		const key = `${question.id}-${dateStr}`;
		const newDoneMap = { ...doneMap, [key]: !doneMap[key] };
		setDoneMap(newDoneMap);
		await AsyncStorage.setItem("doneMap", JSON.stringify(newDoneMap));
	};

	// Get done status helper
	const getStatus = (questionId: number, dateStr: string) => doneMap[`${questionId}-${dateStr}`] ?? false;

	// All questions for history (including today)
	const allQuestions = [];
	for (let i = 0; i <= 7; i++) {
		// Include today (i=0) and 7 previous days
		let index = (todayIndex - i + questions.length) % questions.length;
		let date = new Date();
		date.setDate(date.getDate() - i);
		const dateStr = date.toDateString();
		allQuestions.push({
			question: questions[index],
			dateStr,
			done: getStatus(questions[index].id, dateStr),
		});
	}

	// Previous 7 days questions (excluding today)
	const previousQuestions = allQuestions.slice(1);

	// All pending questions
	const pendingQuestions = allQuestions.filter((item) => !item.done);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#6C63FF" />
				<Text style={styles.loadingText}>Loading your questions...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#F5F7FF" />

			{selectedQuestion ? (
				// Previous question detail view
				<View style={styles.selectedDetail}>
					<View style={styles.header}>
						<TouchableOpacity style={styles.backButton} onPress={() => setSelectedQuestion(null)}>
							<Ionicons name="arrow-back" size={24} color="#333" />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Challenge Detail</Text>
					</View>

					<ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
						<View style={styles.dateChip}>
							<Ionicons name="calendar" size={16} color="#6C63FF" />
							<Text style={styles.dateChipText}>{formatDate(selectedQuestion.dateStr)}</Text>
						</View>

						<View style={styles.questionCard}>
							<Text style={styles.qTitle}>{selectedQuestion.question.title}</Text>
							<Text style={styles.qDesc}>{selectedQuestion.question.description}</Text>

							<View style={styles.ioContainer}>
								<View style={styles.ioSection}>
									<Text style={styles.ioLabel}>Input:</Text>
									<Text style={styles.ioContent}>{selectedQuestion.question.input}</Text>
								</View>

								<View style={styles.ioSection}>
									<Text style={styles.ioLabel}>Output:</Text>
									<Text style={styles.ioContent}>{selectedQuestion.question.output}</Text>
								</View>
							</View>
						</View>

						<TouchableOpacity
							style={[
								styles.doneButton,
								getStatus(selectedQuestion.question.id, selectedQuestion.dateStr)
									? styles.doneButtonCompleted
									: styles.doneButtonPending,
							]}
							onPress={toggleDoneSelected}
						>
							<Ionicons
								name={
									getStatus(selectedQuestion.question.id, selectedQuestion.dateStr)
										? "checkmark-circle"
										: "hourglass"
								}
								size={20}
								color="white"
							/>
							<Text style={styles.doneButtonText}>
								{getStatus(selectedQuestion.question.id, selectedQuestion.dateStr)
									? "Mark as Pending"
									: "Mark as Completed"}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			) : (
				// Today's question view
				<>
					<ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
						<View style={styles.todaySection}>
							<View style={styles.todayHeader}>
								<Text style={styles.todayTitle}>Today's Challenge</Text>
								<View style={styles.countdownContainer}>
									<Ionicons name="time-outline" size={16} color="#6C63FF" />
									<Text style={styles.countdownText}>{formatTime(secondsLeft)}</Text>
								</View>
							</View>

							<View style={styles.questionCard}>
								<Text style={styles.qTitle}>{todayQuestion.title}</Text>
								<Text style={styles.qDesc}>{todayQuestion.description}</Text>

								<View style={styles.ioContainer}>
									<View style={styles.ioSection}>
										<Text style={styles.ioLabel}>Input:</Text>
										<Text style={styles.ioContent}>{todayQuestion.input}</Text>
									</View>

									<View style={styles.ioSection}>
										<Text style={styles.ioLabel}>Output:</Text>
										<Text style={styles.ioContent}>{todayQuestion.output}</Text>
									</View>
								</View>
							</View>

							<TouchableOpacity
								style={[
									styles.doneButton,
									getStatus(todayQuestion.id, new Date().toDateString())
										? styles.doneButtonCompleted
										: styles.doneButtonPending,
								]}
								onPress={toggleDone}
							>
								<Ionicons
									name={
										getStatus(todayQuestion.id, new Date().toDateString())
											? "checkmark-circle"
											: "hourglass"
									}
									size={20}
									color="white"
								/>
								<Text style={styles.doneButtonText}>
									{getStatus(todayQuestion.id, new Date().toDateString())
										? "Mark as Pending"
										: "Mark as Completed"}
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.historySection}>
							<Text style={styles.historyTitle}>Challenge History</Text>
							<Text style={styles.historySubtitle}>Tap a card to view details</Text>

							<FlatList
								data={previousQuestions}
								keyExtractor={(item) => item.question.id.toString() + item.dateStr}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.historyList}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={[
											styles.prevCard,
											item.done ? styles.prevCardDone : styles.prevCardPending,
										]}
										onPress={() =>
											setSelectedQuestion({
												question: item.question,
												dateStr: item.dateStr,
											})
										}
									>
										<Text style={styles.prevDate}>{formatDate(item.dateStr)}</Text>
										<Text style={styles.prevTitle}>{item.question.title}</Text>
										<View style={styles.statusContainer}>
											<Ionicons
												name={item.done ? "checkmark-circle" : "hourglass"}
												size={16}
												color={item.done ? "#2E7D32" : "#D84315"}
											/>
											<Text
												style={[
													styles.statusText,
													item.done ? styles.statusDone : styles.statusPending,
												]}
											>
												{item.done ? "Completed" : "Pending"}
											</Text>
										</View>
									</TouchableOpacity>
								)}
							/>
						</View>

						<View style={styles.statsSection}>
							<Text style={styles.statsTitle}>Your Progress</Text>
							<View style={styles.statsCards}>
								<View style={styles.statCard}>
									<Text style={styles.statNumber}>
										{Object.values(doneMap).filter(Boolean).length}
									</Text>
									<Text style={styles.statLabel}>Completed</Text>
								</View>
								<TouchableOpacity style={styles.statCard} onPress={() => setShowPendingModal(true)}>
									<Text style={styles.statNumber}>
										{allQuestions.length - Object.values(doneMap).filter(Boolean).length}
									</Text>
									<Text style={styles.statLabel}>Pending</Text>
									<Text style={styles.tapHint}>Tap to view</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>

					{/* Pending Questions Modal */}
					<Modal
						animationType="slide"
						transparent={true}
						visible={showPendingModal}
						onRequestClose={() => setShowPendingModal(false)}
					>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<View style={styles.modalHeader}>
									<Text style={styles.modalTitle}>Pending Challenges</Text>
									<TouchableOpacity
										style={styles.closeButton}
										onPress={() => setShowPendingModal(false)}
									>
										<Ionicons name="close" size={24} color="#333" />
									</TouchableOpacity>
								</View>

								{pendingQuestions.length === 0 ? (
									<View style={styles.emptyState}>
										<Ionicons name="checkmark-circle" size={48} color="#6C63FF" />
										<Text style={styles.emptyStateText}>
											Great job! You have no pending challenges.
										</Text>
									</View>
								) : (
									<FlatList
										data={pendingQuestions}
										keyExtractor={(item) => item.question.id.toString() + item.dateStr}
										contentContainerStyle={styles.pendingList}
										renderItem={({ item }) => (
											<TouchableOpacity
												style={styles.pendingCard}
												onPress={() => {
													setSelectedQuestion({
														question: item.question,
														dateStr: item.dateStr,
													});
													setShowPendingModal(false);
												}}
											>
												<View style={styles.pendingCardHeader}>
													<Text style={styles.pendingDate}>{formatDate(item.dateStr)}</Text>
													<View style={styles.statusTag}>
														<Ionicons name="hourglass" size={14} color="#D84315" />
														<Text style={styles.statusTagText}>Pending</Text>
													</View>
												</View>
												<Text style={styles.pendingTitle}>{item.question.title}</Text>
												<Text style={styles.pendingDesc} numberOfLines={2}>
													{item.question.description}
												</Text>
												<View style={styles.viewMoreContainer}>
													<Text style={styles.viewMore}>View Challenge</Text>
													<Ionicons name="chevron-forward" size={16} color="#6C63FF" />
												</View>
											</TouchableOpacity>
										)}
									/>
								)}
							</View>
						</View>
					</Modal>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FF",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5F7FF",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#6C63FF",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 8,
		backgroundColor: "#F5F7FF",
	},
	backButton: {
		marginRight: 16,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#333",
	},
	mainContent: {
		flex: 1,
		padding: 16,
	},
	todaySection: {
		marginBottom: 24,
	},
	todayHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	todayTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
	},
	countdownContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ECEEFF",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	countdownText: {
		marginLeft: 4,
		fontSize: 14,
		fontWeight: "600",
		color: "#6C63FF",
	},
	questionCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		elevation: 3,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
	},
	qTitle: {
		fontSize: 19,
		fontWeight: "700",
		marginBottom: 12,
		color: "#212121",
	},
	qDesc: {
		fontSize: 15,
		marginBottom: 16,
		lineHeight: 22,
		color: "#424242",
	},
	ioContainer: {
		backgroundColor: "#F5F7FF",
		borderRadius: 12,
		padding: 12,
	},
	ioSection: {
		marginBottom: 12,
	},
	ioLabel: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 4,
		color: "#6C63FF",
	},
	ioContent: {
		fontSize: 14,
		fontFamily: "monospace",
		backgroundColor: "#ECEEFF",
		padding: 8,
		borderRadius: 8,
		color: "#424242",
	},
	doneButton: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 14,
		borderRadius: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	doneButtonCompleted: {
		backgroundColor: "#2E7D32",
	},
	doneButtonPending: {
		backgroundColor: "#6C63FF",
	},
	doneButtonText: {
		marginLeft: 8,
		fontSize: 16,
		fontWeight: "700",
		color: "white",
	},
	historySection: {
		marginBottom: 24,
	},
	historyTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 4,
	},
	historySubtitle: {
		fontSize: 14,
		color: "#757575",
		marginBottom: 12,
	},
	historyList: {
		paddingVertical: 8,
	},
	prevCard: {
		width: 180,
		borderRadius: 16,
		padding: 16,
		marginRight: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	prevCardDone: {
		backgroundColor: "#E8F5E9",
	},
	prevCardPending: {
		backgroundColor: "#FFF3E0",
	},
	prevDate: {
		fontSize: 12,
		fontWeight: "600",
		color: "#757575",
		marginBottom: 8,
	},
	prevTitle: {
		fontSize: 15,
		fontWeight: "700",
		marginBottom: 12,
		color: "#333",
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusText: {
		marginLeft: 4,
		fontSize: 13,
		fontWeight: "600",
	},
	statusDone: {
		color: "#2E7D32",
	},
	statusPending: {
		color: "#D84315",
	},
	selectedDetail: {
		flex: 1,
	},
	detailContent: {
		flex: 1,
		padding: 16,
	},
	dateChip: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: "#ECEEFF",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 16,
		marginBottom: 16,
	},
	dateChipText: {
		marginLeft: 6,
		fontSize: 14,
		fontWeight: "600",
		color: "#6C63FF",
	},
	statsSection: {
		marginBottom: 24,
	},
	statsTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 12,
	},
	statsCards: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statCard: {
		flex: 1,
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 16,
		alignItems: "center",
		marginHorizontal: 6,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	statNumber: {
		fontSize: 28,
		fontWeight: "700",
		color: "#6C63FF",
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 14,
		color: "#757575",
	},
	tapHint: {
		fontSize: 12,
		color: "#6C63FF",
		marginTop: 4,
		fontWeight: "500",
	},
	modalContainer: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: "#F5F7FF",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingBottom: 24,
		maxHeight: "80%",
		minHeight: "50%",
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
	},
	closeButton: {
		padding: 4,
	},
	pendingList: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	pendingCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 16,
		marginTop: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	pendingCardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	pendingDate: {
		fontSize: 12,
		fontWeight: "600",
		color: "#757575",
	},
	statusTag: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFF3E0",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusTagText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#D84315",
		marginLeft: 4,
	},
	pendingTitle: {
		fontSize: 17,
		fontWeight: "700",
		marginBottom: 8,
		color: "#212121",
	},
	pendingDesc: {
		fontSize: 14,
		color: "#757575",
		marginBottom: 12,
	},
	viewMoreContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	viewMore: {
		fontSize: 14,
		fontWeight: "600",
		color: "#6C63FF",
		marginRight: 4,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 40,
	},
	emptyStateText: {
		marginTop: 16,
		fontSize: 16,
		textAlign: "center",
		color: "#333",
	},
});
