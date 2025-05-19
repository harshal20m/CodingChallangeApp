import { StyleSheet, View } from "react-native";
import QuestionOfDay from "../components/QuestionOfDay";

export default function HomePage() {
	return (
		<View style={styles.container}>
			<QuestionOfDay />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#f0f4f8" },
	title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
});
