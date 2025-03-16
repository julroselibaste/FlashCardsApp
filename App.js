// App.js
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@flashcards';

export default function App() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    loadCards();
  }, []);

  // Load cards from AsyncStorage
  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCards !== null) {
        setCards(JSON.parse(storedCards));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cards');
    }
  };

  // Save cards to AsyncStorage
  const saveCards = async (updatedCards) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    } catch (error) {
      Alert.alert('Error', 'Failed to save cards');
    }
  };

  // Add a new card or update existing one
  const saveCard = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Question and answer cannot be empty');
      return;
    }

    let updatedCards;
    if (editingCard !== null) {
      // Update existing card
      updatedCards = cards.map((card, index) => 
        index === editingCard ? { question, answer } : card
      );
    } else {
      // Add new card
      updatedCards = [...cards, { question, answer }];
    }

    setCards(updatedCards);
    saveCards(updatedCards);
    closeModal();
  };

  // Delete a card
  const deleteCard = (index) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedCards = [...cards];
            updatedCards.splice(index, 1);
            setCards(updatedCards);
            saveCards(updatedCards);
          }
        }
      ]
    );
  };

  // Open modal for editing
  const openEditModal = (index) => {
    setEditingCard(index);
    setQuestion(cards[index].question);
    setAnswer(cards[index].answer);
    setModalVisible(true);
  };

  // Open modal for adding
  const openAddModal = () => {
    setEditingCard(null);
    setQuestion('');
    setAnswer('');
    setModalVisible(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setModalVisible(false);
    setQuestion('');
    setAnswer('');
    setEditingCard(null);
  };

  // Enter study mode
  const enterStudyMode = () => {
    if (cards.length === 0) {
      Alert.alert('No Cards', 'Add some cards before studying');
      return;
    }
    setStudyMode(true);
    setShowAnswer(false);
    setCurrentCardIndex(0);
  };

  // Exit study mode
  const exitStudyMode = () => {
    setStudyMode(false);
  };

  // Navigate to next card in study mode
  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      Alert.alert(
        'End of Cards',
        'You have reached the end of your flashcards',
        [{ text: 'Restart', onPress: () => {
          setCurrentCardIndex(0);
          setShowAnswer(false);
        }}, 
        { text: 'Exit', onPress: exitStudyMode }]
      );
    }
  };

  // Render individual card in the list
  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardQuestion}>{item.question}</Text>
        <Text style={styles.cardAnswer}>{item.answer}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => openEditModal(index)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCard(index)} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      </View>
    </View>
  );

  // Study mode screen
  if (studyMode) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.studyContainer}>
          <Text style={styles.studyHeader}>Studying: Card {currentCardIndex + 1} of {cards.length}</Text>
          
          <View style={styles.studyCard}>
            <Text style={styles.studyQuestion}>{cards[currentCardIndex].question}</Text>
            
            {showAnswer ? (
              <View style={styles.answerContainer}>
                <Text style={styles.studyAnswer}>{cards[currentCardIndex].answer}</Text>
                <TouchableOpacity onPress={nextCard} style={styles.nextButton}>
                  <Text style={styles.buttonText}>Next Card</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={() => setShowAnswer(true)} 
                style={styles.showAnswerButton}
              >
                <Text style={styles.buttonText}>Show Answer</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity onPress={exitStudyMode} style={styles.exitButton}>
            <Text style={styles.buttonText}>Exit Study Mode</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main app screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Flashcards</Text>

      {cards.length > 0 ? (
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(_, index) => index.toString()}
          style={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No flashcards yet. Create one!</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <Text style={styles.buttonText}>Add Card</Text>
        </TouchableOpacity>
        
        {cards.length > 0 && (
          <TouchableOpacity onPress={enterStudyMode} style={styles.studyButton}>
            <Text style={styles.buttonText}>Study</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for adding/editing cards */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCard !== null ? 'Edit Card' : 'Add New Card'}
            </Text>
            
            <Text style={styles.inputLabel}>Question:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setQuestion}
              value={question}
              placeholder="Enter question"
              multiline
            />
            
            <Text style={styles.inputLabel}>Answer:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setAnswer}
              value={answer}
              placeholder="Enter answer"
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveCard} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#333',
  },
  list: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  cardAnswer: {
    fontSize: 16,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  studyButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    minHeight: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
  },
  studyContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studyHeader: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  studyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  studyQuestion: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  answerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  studyAnswer: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#4CAF50',
  },
  showAnswerButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exitButton: {
    backgroundColor: '#757575',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});