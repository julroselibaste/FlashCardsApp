import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { saveFlashcards, loadFlashcards } from '../storage/storage';

const AddFlashcardScreen = ({ navigation }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSave = async () => {
        const flashcards = await loadFlashcards();
        const newCard = { id: Date.now(), question, answer };
        const updatedFlashcards = [...flashcards, newCard];
        await saveFlashcards(updatedFlashcards);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Question:</Text>
            <TextInput style={styles.input} value={question} onChangeText={setQuestion} />
            <Text style={styles.label}>Answer:</Text>
            <TextInput style={styles.input} value={answer} onChangeText={setAnswer} />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
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

export default AddFlashcardScreen;
