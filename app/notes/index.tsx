// app/notes/index.js
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteNote, getNotes } from "../../hooks/useNotes";

export default function NotesScreen() {
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);

	// Use useFocusEffect to refresh notes when this screen comes into focus
	useFocusEffect(
		useCallback(() => {
			fetchNotes();
		}, [])
	);

	const fetchNotes = async () => {
		setLoading(true);
		try {
			const storedNotes = await getNotes();
			// Sort notes by most recently updated
			const sortedNotes = storedNotes.sort((a, b) => {
				return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
			});
			setNotes(sortedNotes);
		} catch (error) {
			console.error("Error fetching notes:", error);
			Alert.alert("Error", "Could not load your notes.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteNote = (id) => {
		Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						await deleteNote(id);
						await fetchNotes(); // Refresh the list
					} catch (error) {
						console.error("Error deleting note:", error);
						Alert.alert("Error", "Could not delete the note.");
					}
				},
			},
		]);
	};

	const renderNoteItem = ({ item }) => (
		<TouchableOpacity style={styles.noteItem} onPress={() => router.push(`/notes/id/${item.id}`)}>
			<View style={styles.noteHeader}>
				<Text style={styles.noteTitle} numberOfLines={1}>
					{item.title}
				</Text>
				<TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(item.id)}>
					<Ionicons name="trash-outline" size={18} color="#E63946" />
				</TouchableOpacity>
			</View>
			<Text style={styles.noteContent} numberOfLines={2}>
				{item.content || "No content"}
			</Text>
			<Text style={styles.noteDate}>
				{item.updatedAt
					? `Updated: ${new Date(item.updatedAt).toLocaleString()}`
					: item.createdAt
					? `Created: ${new Date(item.createdAt).toLocaleString()}`
					: ""}
			</Text>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>📝 Your Notes</Text>

			{/* Notes list */}
			{loading ? (
				<ActivityIndicator size="large" color="#3066BE" style={styles.loader} />
			) : notes.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No notes yet. Create one!</Text>
				</View>
			) : (
				<FlatList
					data={notes}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderNoteItem}
					contentContainerStyle={styles.listContent}
				/>
			)}

			{/* Floating Action Button to Create New Note */}
			<TouchableOpacity
				style={styles.createButton}
				onPress={() => router.push("/notes/id/new")}
				activeOpacity={0.7}
			>
				<Ionicons name="add" size={28} color="white" />
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
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#333",
	},
	createButton: {
		position: "absolute",
		right: 20,
		bottom: 20,
		backgroundColor: "#3066BE",
		width: 60,
		height: 60,
		borderRadius: 30,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 999,
	},
	noteItem: {
		padding: 16,
		backgroundColor: "#ffffff",
		borderRadius: 8,
		marginBottom: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	noteTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#3066BE",
		flex: 1,
		marginRight: 8,
	},
	noteContent: {
		fontSize: 14,
		color: "#555",
		marginBottom: 8,
	},
	noteDate: {
		fontSize: 12,
		color: "#999",
		fontStyle: "italic",
	},
	deleteButton: {
		padding: 5,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: "#888",
		textAlign: "center",
	},
	loader: {
		marginTop: 20,
	},
	listContent: {
		paddingBottom: 80, // Space for FAB
	},
});
