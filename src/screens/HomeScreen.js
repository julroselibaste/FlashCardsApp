import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { loadFlashcards, deleteFlashcard } from '../storage/storage';

const HomeScreen = ({ navigation }) => {
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        loadFlashcards().then(setFlashcards);
    }, []);

    const handleDelete = async (id) => {
        await deleteFlashcard(id);
        const updatedFlashcards = flashcards.filter(card => card.id !== id);
        setFlashcards(updatedFlashcards);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={flashcards}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}>{item.question}</Text>
                        <Text style={styles.text}>{item.answer}</Text>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity onPress={() => navigation.navigate('AddFlashcard')} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Flashcard</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    card: { backgroundColor: '#fff', padding: 20, marginBottom: 10, borderRadius: 10, shadowOpacity: 0.1, elevation: 5 },
    text: { fontSize: 16, fontWeight: 'bold' },
    deleteButton: { marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5 },
    deleteText: { color: '#fff', textAlign: 'center' },
    addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'blue', padding: 15, borderRadius: 10 },
    addButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default HomeScreen;
