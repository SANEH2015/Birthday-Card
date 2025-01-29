import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, FlatList, Button } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import ColorPicker from 'react-native-color-picker'; // Add a color picker library

export default function BirthdayCardApp() {
    const [message, setMessage] = useState('Happy Birthday!');
    const [shortMessage, setShortMessage] = useState('Wishing you all the best!'); // New state for short message
    const [fontSize, setFontSize] = useState(24);
    const [fontColor, setFontColor] = useState('#000000'); // Black text color
    const [background, setBackground] = useState(require('../../assets/images/template1.jpg'));
    const [selectedImage, setSelectedImage] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [emojiModalVisible, setEmojiModalVisible] = useState(false);
    const viewShotRef = useRef(null);

    // Function to pick an image
    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets && response.assets.length > 0) {
                setSelectedImage({ uri: response.assets[0].uri });
            }
        });
    };

    // Function to capture and share the card
    const shareCard = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    // Add emoji to the message
    const addEmoji = (emoji) => {
        setMessage(prevMessage => prevMessage + emoji);
        setEmojiModalVisible(false); // Close emoji modal after selection
    };

    // Emoji list for selection
    const emojis = ['😊', '🎉', '❤️', '🎂', '🥳', '🌸', '💐', '💖'];

    return (
        <View style={styles.container}>
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
                <View style={styles.card}>
                    <Image source={background} style={styles.cardBackground} />
                    {selectedImage && <Image source={selectedImage} style={styles.userImage} />}
                    <Text style={[styles.message, { fontSize, color: fontColor }]}>{message}</Text>
                    <Text style={[styles.shortMessage, { fontSize: fontSize - 6, color: fontColor }]}>{shortMessage}</Text> {/* Short message below */}
                </View>
            </ViewShot>

            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Enter your sweet message"
            />

            <TextInput
                style={styles.input}
                value={shortMessage}
                onChangeText={setShortMessage} // Update short message state
                placeholder="Enter a short message"
            />

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setShowColorPicker(true)}>
                <Text style={styles.buttonText}>Pick Text Color</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setEmojiModalVisible(true)}>
                <Text style={styles.buttonText}>Add Emoji</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={shareCard}>
                <Text style={styles.buttonText}>Share Card</Text>
            </TouchableOpacity>

            {/* Color Picker Modal */}
            {showColorPicker && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showColorPicker}
                    onRequestClose={() => setShowColorPicker(false)}
                >
                    <View style={styles.modalContainer}>
                        <ColorPicker
                            onColorSelected={color => {
                                setFontColor(color);
                                setShowColorPicker(false);
                            }}
                            style={styles.colorPicker}
                        />
                        <Button title="Close" onPress={() => setShowColorPicker(false)} />
                    </View>
                </Modal>
            )}

            {/* Emoji Modal */}
            {emojiModalVisible && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={emojiModalVisible}
                    onRequestClose={() => setEmojiModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={emojis}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => addEmoji(item)}>
                                    <Text style={styles.emoji}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={4}
                        />
                        <Button title="Close" onPress={() => setEmojiModalVisible(false)} />
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f8' },
    card: { width: 300, height: 400, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    cardBackground: { width: '100%', height: '100%', position: 'absolute' },
    userImage: { width: 100, height: 100, borderRadius: 50, position: 'absolute', top: 30 },
    message: { 
        position: 'absolute', 
        textAlign: 'center', 
        fontWeight: 'bold', 
        width: '80%', 
        top: '40%', // Centers vertically
        transform: [{ translateY: -12 }] // Adjust for better centering
    },
    shortMessage: { 
        position: 'absolute', 
        textAlign: 'center', 
        fontWeight: 'normal', 
        width: '80%', 
        top: '55%', // Position it just below the main message
        transform: [{ translateY: -12 }]
    },
    input: { width: 250, height: 40, borderWidth: 1, marginVertical: 10, paddingHorizontal: 10, backgroundColor: '#fff' },
    button: { backgroundColor: '#ff4081', padding: 10, borderRadius: 10, marginVertical: 5 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    colorPicker: { width: 300, height: 300 },
    emoji: { fontSize: 30, margin: 5 },
});
