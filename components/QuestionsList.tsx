import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	AppState,
	AppStateStatus,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import questions from "../data/questions";

// Get questions that are released based on date
function getReleasedQuestions() {
	const startDate = new Date(2025, 0, 1); // Jan 1, 2025
	const today = new Date();
	const diffTime = today.getTime() - startDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	// Only show questions up to the current day index
	return questions.filter((_, index) => index <= diffDays);
}

export default function QuestionsList() {
	const [doneMap, setDoneMap] = useState<{ [key: string]: boolean }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [filterType, setFilterType] = useState<"all" | "completed" | "pending">("all");
	const [releasedQuestions, setReleasedQuestions] = useState<typeof questions>([]);

	// Update released questions based on current date
	const updateReleasedQuestions = useCallback(() => {
		setReleasedQuestions(getReleasedQuestions());
	}, []);

	// Listen for app state changes to refresh questions when app comes to foreground
	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
			if (nextAppState === "active") {
				updateReleasedQuestions();
			}
		});

		return () => {
			subscription.remove();
		};
	}, [updateReleasedQuestions]);

	useEffect(() => {
		// Load done statuses from AsyncStorage and update released questions
		async function loadDone() {
			try {
				setIsLoading(true);
				const stored = await AsyncStorage.getItem("doneMap");
				if (stored) setDoneMap(JSON.parse(stored));
				updateReleasedQuestions(); // Initialize released questions on load
				setIsLoading(false);
			} catch (e) {
				console.error("Failed to load done status", e);
				setIsLoading(false);
			}
		}
		loadDone();

		// Set up timer to check for new questions at midnight
		const checkForNewQuestionsAtMidnight = () => {
			const now = new Date();
			const tomorrow = new Date(now);
			tomorrow.setDate(now.getDate() + 1);
			tomorrow.setHours(0, 0, 0, 0);

			const timeUntilMidnight = tomorrow.getTime() - now.getTime();

			return setTimeout(() => {
				updateReleasedQuestions();
				// Set up the next check
				midnightTimerId = checkForNewQuestionsAtMidnight();
			}, timeUntilMidnight);
		};

		// Start the midnight check timer
		let midnightTimerId = checkForNewQuestionsAtMidnight();

		// Clean up the timer when component unmounts
		return () => {
			clearTimeout(midnightTimerId);
		};
	}, [updateReleasedQuestions]);

	// Get done status helper for any question
	const getStatus = (questionId: number) => {
		// Check if the question was completed on any date
		const keys = Object.keys(doneMap);
		return keys.some((key) => key.startsWith(`${questionId}-`) && doneMap[key]);
	};

	// Count completed questions (only from released questions)
	const completedCount = releasedQuestions.filter((q) => getStatus(q.id)).length;
	const remainingCount = releasedQuestions.length - completedCount;

	// Filter questions based on status from the released questions
	const getFilteredQuestions = () => {
		if (filterType === "all") return releasedQuestions;
		if (filterType === "completed") return releasedQuestions.filter((q) => getStatus(q.id));
		if (filterType === "pending") return releasedQuestions.filter((q) => !getStatus(q.id));
		return releasedQuestions; // Fallback, though should not be reached
	};

	// Get the filtered questions
	const filteredQuestions = getFilteredQuestions();

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
			<View style={styles.headerContainer}>
				<Text style={styles.header}>Questions</Text>
				<View style={styles.statsContainer}>
					<View style={styles.statItem}>
						<Text style={styles.statValue}>{completedCount}</Text>
						<Text style={styles.statLabel}>Completed</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Text style={styles.statValue}>{remainingCount}</Text>
						<Text style={styles.statLabel}>Remaining</Text>
					</View>
				</View>
			</View>

			{/* Filter tabs */}
			<View style={styles.filterContainer}>
				<TouchableOpacity
					style={[styles.filterTab, filterType === "all" && styles.activeFilterTab]}
					onPress={() => setFilterType("all")}
				>
					<Text style={[styles.filterText, filterType === "all" && styles.activeFilterText]}>
						All ({releasedQuestions.length})
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.filterTab, filterType === "completed" && styles.activeFilterTab]}
					onPress={() => setFilterType("completed")}
				>
					<Text style={[styles.filterText, filterType === "completed" && styles.activeFilterText]}>
						Completed ({completedCount})
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.filterTab, filterType === "pending" && styles.activeFilterTab]}
					onPress={() => setFilterType("pending")}
				>
					<Text style={[styles.filterText, filterType === "pending" && styles.activeFilterText]}>
						Pending ({remainingCount})
					</Text>
				</TouchableOpacity>
			</View>

			{filteredQuestions.length === 0 ? (
				<View style={styles.emptyState}>
					<Ionicons
						name={filterType === "completed" ? "checkmark-circle" : "hourglass"}
						size={48}
						color="#6C63FF"
					/>
					<Text style={styles.emptyStateText}>
						{filterType === "completed"
							? "You haven't completed any released questions yet."
							: "No pending released questions found."}
					</Text>
				</View>
			) : (
				<FlatList
					data={filteredQuestions}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => {
						const isCompleted = getStatus(item.id);
						return (
							<Link href={`/questions/${item.id}`} asChild>
								<TouchableOpacity
									style={[styles.item, isCompleted ? styles.completedItem : styles.pendingItem]}
									activeOpacity={0.7}
								>
									<View style={styles.contentContainer}>
										<View style={styles.titleRow}>
											<Text style={styles.title} numberOfLines={2}>
												{item.title}
											</Text>
											{isCompleted ? (
												<View style={styles.checkmarkContainer}>
													<Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
												</View>
											) : (
												<View style={styles.progressContainer}>
													<Ionicons name="hourglass" size={20} color="#D84315" />
												</View>
											)}
										</View>
										<View style={styles.detailsRow}>
											<View style={styles.statusContainer}>
												<View
													style={[
														styles.statusIndicator,
														isCompleted
															? styles.completedIndicator
															: styles.pendingIndicator,
													]}
												/>
												<Text
													style={[
														styles.statusText,
														isCompleted ? styles.completedText : styles.pendingText,
													]}
												>
													{isCompleted ? "Completed" : "Pending"}
												</Text>
											</View>
											<View style={styles.arrowContainer}>
												<Ionicons name="chevron-forward" size={16} color="#757575" />
											</View>
										</View>
									</View>
								</TouchableOpacity>
							</Link>
						);
					}}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 24,
		paddingHorizontal: 16,
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
	headerContainer: {
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	header: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#333",
	},
	statsContainer: {
		flexDirection: "row",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#6C63FF",
	},
	statLabel: {
		fontSize: 14,
		color: "#757575",
		marginTop: 4,
	},
	statDivider: {
		width: 1,
		backgroundColor: "#ECEEFF",
		marginHorizontal: 8,
	},
	filterContainer: {
		flexDirection: "row",
		marginBottom: 16,
		backgroundColor: "#ECEEFF",
		borderRadius: 12,
		padding: 4,
	},
	filterTab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: 10,
	},
	activeFilterTab: {
		backgroundColor: "#6C63FF",
	},
	filterText: {
		fontWeight: "600",
		color: "#6C63FF",
		fontSize: 14,
	},
	activeFilterText: {
		color: "white",
	},
	listContent: {
		paddingBottom: 24,
	},
	item: {
		padding: 16,
		backgroundColor: "white",
		borderRadius: 16,
		marginHorizontal: 2,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
		borderLeftWidth: 4,
	},
	pendingItem: {
		borderLeftColor: "#D84315",
	},
	completedItem: {
		borderLeftColor: "#2E7D32",
		backgroundColor: "#FBFFF9",
	},
	separator: {
		height: 12,
	},
	contentContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		gap: 12,
	},
	titleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		flex: 1,
		paddingRight: 8,
	},
	checkmarkContainer: {
		width: 28,
		height: 28,
		justifyContent: "center",
		alignItems: "center",
	},
	progressContainer: {
		width: 28,
		height: 28,
		justifyContent: "center",
		alignItems: "center",
	},
	detailsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 6,
	},
	completedIndicator: {
		backgroundColor: "#2E7D32",
	},
	pendingIndicator: {
		backgroundColor: "#D84315",
	},
	statusText: {
		fontSize: 14,
		fontWeight: "600",
	},
	completedText: {
		color: "#2E7D32",
	},
	pendingText: {
		color: "#D84315",
	},
	arrowContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 40,
	},
	emptyStateText: {
		marginTop: 16,
		fontSize: 16,
		textAlign: "center",
		color: "#333",
		maxWidth: "80%",
	},
});
