import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChatBubble({ message }) {
    const isAI = message.sender === 'ai';

    return (
        <Animated.View
            entering={isAI ? FadeInLeft.springify().mass(0.5) : FadeInRight.springify().mass(0.5)}
            style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}
        >
            {isAI && (
                <View style={styles.aiAvatar}>
                    <Text style={styles.aiAvatarEmoji}>🤖</Text>
                </View>
            )}
            <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
                {!isAI && (
                    <LinearGradient
                        colors={['#FF4500', '#FF8C00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    />
                )}
                <Text style={[styles.messageText, !isAI && styles.userMessageText]}>
                    {message.text}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    aiContainer: {
        justifyContent: 'flex-start',
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginTop: 'auto',
        marginBottom: 4,
    },
    aiAvatarEmoji: {
        fontSize: 14,
    },
    bubble: {
        maxWidth: '80%',
        padding: 16,
    },
    aiBubble: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#333',
    },
    userBubble: {
        borderRadius: 16,
        borderBottomRightRadius: 4,
        overflow: 'hidden',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    messageText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 24,
    },
    userMessageText: {
        fontWeight: '500',
    },
});
