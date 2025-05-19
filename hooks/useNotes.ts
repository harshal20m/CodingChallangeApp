import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTES_STORAGE_KEY = "saved_notes";

// Fetch all notes
export const getNotes = async () => {
	try {
		const notes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
		return notes ? JSON.parse(notes) : [];
	} catch (error) {
		console.error("Error fetching notes:", error);
		return [];
	}
};

// Save a new note
export const saveNote = async (note) => {
	try {
		const notes = await getNotes();
		notes.push(note);
		await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
		return true;
	} catch (error) {
		console.error("Error saving note:", error);
		return false;
	}
};

// Update an existing note
export const updateNote = async (id, updatedNote) => {
	try {
		let notes = await getNotes();
		notes = notes.map((note) => (note.id === id ? { ...note, ...updatedNote, updatedAt: new Date() } : note));
		await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
		return true;
	} catch (error) {
		console.error("Error updating note:", error);
		return false;
	}
};

// Delete a note
export const deleteNote = async (id) => {
	try {
		let notes = await getNotes();
		notes = notes.filter((note) => note.id !== id);
		await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
		return true;
	} catch (error) {
		console.error("Error deleting note:", error);
		return false;
	}
};
