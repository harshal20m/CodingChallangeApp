import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import questions from "../../data/questions";

export default function QuestionDetails() {
	const { id } = useLocalSearchParams();
	const question = questions.find((q) => q.id.toString() === id);

	if (!question) {
		return (
			<SafeAreaView style={styles.errorContainer}>
				<Text style={styles.errorText}>Question not found</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>{question.title}</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Description</Text>
						<Text style={styles.description}>{question.description}</Text>
					</View>

					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Example</Text>
						<View style={styles.ioContainer}>
							<Text style={styles.ioLabel}>Input:</Text>
							<Text style={styles.ioContent}>{question.input}</Text>
						</View>

						<View style={styles.ioContainer}>
							<Text style={styles.ioLabel}>Output:</Text>
							<Text style={styles.ioContent}>{question.output}</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollView: {
		flex: 1,
	},
	container: {
		padding: 16,
		paddingBottom: 24,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 18,
		color: "#dc3545",
		textAlign: "center",
	},
	header: {
		marginBottom: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#212529",
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
		color: "#495057",
	},
	description: {
		fontSize: 16,
		lineHeight: 24,
		color: "#343a40",
	},
	ioContainer: {
		marginTop: 12,
	},
	ioLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#495057",
		marginBottom: 4,
	},
	ioContent: {
		fontSize: 15,
		backgroundColor: "#f1f3f5",
		padding: 12,
		borderRadius: 6,
		fontFamily: "monospace",
		color: "#212529",
	},
});
