import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { saveFlashcards, loadFlashcards } from '../storage/storage';

const EditFlashcardScreen = ({ route, navigation }) => {
    const { flashcard } = route.params;
    const [question, setQuestion] = useState(flashcard.question);
    const [pronunciation, setPronunciation] = useState(flashcard.pronunciation || '');
    const [answer, setAnswer] = useState(flashcard.answer);

    const handleSave = async () => {
        const flashcards = await loadFlashcards();
        const updatedFlashcards = flashcards.map(card =>
            card.id === flashcard.id ? { ...card, question, pronunciation, answer } : card
        );
        await saveFlashcards(updatedFlashcards);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Word:</Text>
            <TextInput style={styles.input} value={question} onChangeText={setQuestion} />

            <Text style={styles.label}>Pronunciation:</Text>
            <TextInput style={styles.input} value={pronunciation} onChangeText={setPronunciation} />

            <Text style={styles.label}>Definition:</Text>
            <TextInput style={styles.input} value={answer} onChangeText={setAnswer} />

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    saveButton: { backgroundColor: 'green', padding: 15, borderRadius: 10 },
    saveButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

export default EditFlashcardScreen;
