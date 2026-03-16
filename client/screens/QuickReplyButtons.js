import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function QuickReplyButtons({ options, onSelect }) {
    return (
        <View style={styles.container}>
            {options.map((option, index) => (
                <Animated.View
                    key={index}
                    entering={FadeInUp.delay(index * 80).springify().mass(0.6)}
                >
                    <TouchableOpacity
                        onPress={() => onSelect(option)}
                        activeOpacity={0.7}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{option}</Text>
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 8,
        backgroundColor: '#0A0A0A',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingBottom: 24,
        flexShrink: 0,
    },
    button: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 999,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: 14,
    },
});
