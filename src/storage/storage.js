import AsyncStorage from '@react-native-async-storage/async-storage';

const FLASHCARDS_KEY = 'flashcards';

// Save flashcards
export const saveFlashcards = async (flashcards) => {
    try {
        const jsonValue = JSON.stringify(flashcards);
        await AsyncStorage.setItem(FLASHCARDS_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving flashcards:', e);
    }
};

// Load flashcards
export const loadFlashcards = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FLASHCARDS_KEY);
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error loading flashcards:', e);
        return [];
    }
};

// Delete a flashcard
export const deleteFlashcard = async (id) => {
    try {
        const flashcards = await loadFlashcards();
        const updatedFlashcards = flashcards.filter((card) => card.id !== id);
        await saveFlashcards(updatedFlashcards);
    } catch (e) {
        console.error('Error deleting flashcard:', e);
    }
};
