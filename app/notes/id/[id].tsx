import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { getNotes, saveNote, updateNote } from "../../../hooks/useNotes";

export default function NoteView() {
	const { id, mode } = useLocalSearchParams();
	const isNew = id === "new"; // If id === "new", it's a new note
	const isEditMode = mode === "edit" || isNew;
	const [note, setNote] = useState({ title: "", content: "" });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		async function fetchNote() {
			if (!isNew) {
				try {
					const storedNotes = await getNotes();
					const existingNote = storedNotes.find((n) => n.id === Number(id));
					if (existingNote) {
						setNote(existingNote);
					} else {
						Alert.alert("Error", "Note not found", [
							{ text: "OK", onPress: () => router.replace("/notes") },
						]);
					}
				} catch (error) {
					console.error("Error fetching note:", error);
					Alert.alert("Error", "Could not load the note.");
				}
			}
			setLoading(false);
		}
		fetchNote();
	}, [id, isNew]);

	const handleSave = async () => {
		if (!note.title.trim()) {
			Alert.alert("Missing Title", "Please enter a title for your note.");
			return;
		}

		setSaving(true);
		try {
			if (isNew) {
				const newNote = {
					id: Date.now(),
					title: note.title.trim(),
					content: note.content,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				await saveNote(newNote);
			} else {
				await updateNote(Number(id), {
					title: note.title.trim(),
					content: note.content,
				});
			}
			router.replace("/notes");
		} catch (error) {
			console.error("Error saving note:", error);
			Alert.alert("Error", "Could not save the note.");
		} finally {
			setSaving(false);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	// Show loading indicator while fetching note
	if (loading) {
		return (
			<View style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color="#3066BE" />
			</View>
		);
	}

	// Read-only view
	if (!isEditMode) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<Ionicons name="arrow-back" size={24} color="#3066BE" />
					</TouchableOpacity>
					<Text style={styles.title} numberOfLines={1}>
						{note.title}
					</Text>
					<TouchableOpacity
						style={styles.editButton}
						onPress={() => router.push(`/notes/id/${id}?mode=edit`)}
					>
						<Ionicons name="pencil" size={24} color="#3066BE" />
					</TouchableOpacity>
				</View>

				<View style={styles.dateContainer}>
					{note.createdAt && <Text style={styles.dateText}>Created: {formatDate(note.createdAt)}</Text>}
					{note.updatedAt && note.updatedAt !== note.createdAt && (
						<Text style={styles.dateText}>Updated: {formatDate(note.updatedAt)}</Text>
					)}
				</View>

				<ScrollView style={styles.contentContainer}>
					<Text style={styles.contentText}>{note.content || "No content"}</Text>
				</ScrollView>
			</View>
		);
	}

	// Edit mode
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => {
						if (isNew) {
							router.back();
						} else {
							router.replace(`/notes/id/${id}`);
						}
					}}
				>
					<Ionicons name="arrow-back" size={24} color="#3066BE" />
				</TouchableOpacity>
				<Text style={styles.title}>{isNew ? "✍️ Create Note" : "✏️ Edit Note"}</Text>
				<View style={{ width: 24 }} /> {/* Empty view for spacing */}
			</View>

			<TextInput
				style={styles.input}
				placeholder="Title"
				value={note.title}
				onChangeText={(text) => setNote({ ...note, title: text })}
			/>
			<TextInput
				style={[styles.input, styles.textArea]}
				placeholder="Write your notes here..."
				value={note.content}
				multiline
				textAlignVertical="top"
				onChangeText={(text) => setNote({ ...note, content: text })}
			/>
			<TouchableOpacity
				style={[styles.saveButton, saving && styles.disabledButton]}
				onPress={handleSave}
				disabled={saving}
			>
				<Text style={styles.saveText}>{saving ? "Saving..." : isNew ? "Save Note" : "Update Note"}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f9fafb",
	},
	centered: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	backButton: {
		padding: 8,
	},
	editButton: {
		padding: 8,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#333",
		flex: 1,
		textAlign: "center",
		marginHorizontal: 8,
	},
	dateContainer: {
		marginBottom: 16,
		backgroundColor: "#f0f4f9",
		padding: 12,
		borderRadius: 8,
	},
	dateText: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
	},
	contentContainer: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
	},
	contentText: {
		fontSize: 16,
		color: "#333",
		lineHeight: 24,
	},
	input: {
		padding: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		marginBottom: 16,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	textArea: {
		flex: 1,
		textAlignVertical: "top",
		minHeight: 200,
	},
	saveButton: {
		backgroundColor: "#3066BE",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 8,
	},
	disabledButton: {
		backgroundColor: "#9DB5E0",
	},
	saveText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
});
