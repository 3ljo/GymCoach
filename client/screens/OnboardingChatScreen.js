import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, FadeInDown, FadeInLeft, withSequence, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from './ChatBubble';
import QuickReplyButtons from './QuickReplyButtons';

const Dot = ({ delay }) => {
    const translateY = useSharedValue(0);
    useEffect(() => {
        translateY.value = withDelay(delay, withRepeat(withSequence(
            withTiming(-4, { duration: 300 }),
            withTiming(0, { duration: 300 })
        ), -1, true));
    }, [delay, translateY]);
    const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
    return <Animated.View style={[styles.dot, style]} />;
};

const TypingIndicator = () => (
    <Animated.View entering={FadeInLeft.springify().mass(0.5)} style={styles.typingIndicator}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
    </Animated.View>
);

export default function OnboardingChatScreen({ navigation }) {
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [userProfile, setUserProfile] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [inputText, setInputText] = useState('');
    const [multiInput, setMultiInput] = useState({ weight: '', height: '' });

    const scrollViewRef = useRef();

    // Animated Pulse for Top Bar
    const pulse = useSharedValue(1);
    useEffect(() => {
        pulse.value = withRepeat(withTiming(1.3, { duration: 1200 }), -1, true);
    }, [pulse]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 1.3 - pulse.value,
    }));

    // Conversation Flow State Machine
    const steps = [
        { id: 'welcome', type: 'choice', text: "Hey! 👋 I'm your AI coach. I'm going to build you a fully personalized training program — but first I need to know a bit about you. Ready?", options: ["Let's go! 💪", "Sure!"] },
        { id: 'name', type: 'text', text: "Awesome! What's your name?", placeholder: "Your name" },
        { id: 'goal', type: 'choice', text: "Nice to meet you, {name}! What's your main fitness goal?", options: ["Build Muscle 💪", "Lose Fat 🔥", "Get Stronger ⚡", "Improve Endurance 🏃", "General Fitness ✅"] },
        { id: 'experienceLevel', type: 'choice', text: "Got it! How would you describe your experience level?", options: ["Complete Beginner", "Some Experience", "Intermediate", "Advanced"] },
        { id: 'age', type: 'numeric', text: "How old are you?", placeholder: "Age" },
        { id: 'weightHeight', type: 'multi-numeric', text: "What's your current weight and height?" },
        { id: 'equipment', type: 'choice', text: "Where do you usually train?", options: ["Full Gym 🏋️", "Home with Dumbbells 🏠", "Home No Equipment 🧘", "Mix of Both"] },
        { id: 'daysPerWeek', type: 'choice', text: "How many days per week can you train?", options: ["2 days", "3 days", "4 days", "5 days", "6 days"] },
        { id: 'sessionDuration', type: 'choice', text: "And how long can each session be?", options: ["30 min", "45 min", "60 min", "90 min"] },
        { id: 'injuries', type: 'choice_with_custom', text: "Last question — do you have any injuries or physical limitations I should know about?", options: ["No injuries ✅", "Lower back issues", "Knee problems", "Shoulder issues", "Type your own"] },
        { id: 'custom_injury', type: 'text', text: "Please describe your injury or limitation.", placeholder: "Describe your injury" },
        { id: 'done', type: 'loading', text: "Perfect {name}! I have everything I need. Give me a moment while I build your personalized program... 🔥" }
    ];

    useEffect(() => {
        sendAIMessage(0);
    }, []);

    const sendAIMessage = (stepIndex) => {
        setIsTyping(true);
        setTimeout(() => {
            const step = steps[stepIndex];
            const text = step.text.replace('{name}', userProfile.name || '');
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text }]);
            setCurrentStep(stepIndex);
            setIsTyping(false);

            if (step.id === 'done') {
                finishOnboarding();
            }
        }, 1200);
    };

    const finishOnboarding = () => {
        console.log("Onboarding Complete! User Profile: ", userProfile);
        setTimeout(() => {
            navigation.replace('Home');
        }, 2500);
    };

    const handleUserReply = (value, fieldKey) => {
        let replyText = '';
        let updatedProfile = { ...userProfile };

        if (typeof value === 'object' && value !== null) {
            replyText = `${value.weight} kg, ${value.height} cm`;
            updatedProfile = { ...updatedProfile, ...value };
        } else {
            replyText = value;
            if (fieldKey) {
                updatedProfile[fieldKey] = value;
            }
        }

        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: replyText }]);
        setUserProfile(updatedProfile);
        setInputText('');
        setMultiInput({ weight: '', height: '' });

        let nextStep = currentStep + 1;
        if (steps[currentStep].id === 'injuries' && value !== 'Type your own') {
            nextStep = currentStep + 2; // Skip custom_injury step
        }

        sendAIMessage(nextStep);
    };

    const renderInputArea = () => {
        if (currentStep >= steps.length) return null;
        const step = steps[currentStep];

        if (step.type === 'choice' || step.type === 'choice_with_custom') {
            return <QuickReplyButtons options={step.options} onSelect={(val) => handleUserReply(val, step.id)} />;
        }

        if (step.type === 'text' || step.type === 'numeric' || step.id === 'custom_injury') {
            const isNumeric = step.type === 'numeric';
            const fieldKey = step.id === 'custom_injury' ? 'injuries' : step.id;
            return (
                <Animated.View entering={FadeInDown.springify()} style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={step.placeholder || "Type here..."}
                        placeholderTextColor="#666"
                        value={inputText}
                        onChangeText={setInputText}
                        keyboardType={isNumeric ? 'numeric' : 'default'}
                        returnKeyType="send"
                        onSubmitEditing={() => inputText.trim() && handleUserReply(inputText.trim(), fieldKey)}
                        autoFocus
                    />
                    <TouchableOpacity
                        onPress={() => inputText.trim() && handleUserReply(inputText.trim(), fieldKey)}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        disabled={!inputText.trim()}
                    >
                        <LinearGradient colors={['#FF4500', '#FF8C00']} style={styles.gradientSendButton}>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        if (step.type === 'multi-numeric') {
            return (
                <Animated.View entering={FadeInDown.springify()} style={styles.inputContainer}>
                    <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="Weight (kg)"
                        placeholderTextColor="#666"
                        value={multiInput.weight}
                        onChangeText={w => setMultiInput(p => ({ ...p, weight: w }))}
                        keyboardType="numeric"
                        returnKeyType="next"
                    />
                    <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="Height (cm)"
                        placeholderTextColor="#666"
                        value={multiInput.height}
                        onChangeText={h => setMultiInput(p => ({ ...p, height: h }))}
                        keyboardType="numeric"
                        returnKeyType="send"
                        onSubmitEditing={() => multiInput.weight && multiInput.height && handleUserReply(multiInput)}
                    />
                    <TouchableOpacity
                        onPress={() => multiInput.weight && multiInput.height && handleUserReply(multiInput)}
                        style={[styles.sendButton, (!multiInput.weight || !multiInput.height) && styles.sendButtonDisabled]}
                        disabled={!multiInput.weight || !multiInput.height}
                    >
                        <LinearGradient colors={['#FF4500', '#FF8C00']} style={styles.gradientSendButton}>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        if (step.type === 'loading') {
            return (
                <Animated.View entering={FadeInDown} style={styles.loadingContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Animated.View style={[pulseStyle, styles.loadingDot]} />
                        <Text style={styles.loadingText}>Building your program...</Text>
                    </View>
                </Animated.View>
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Header / Top Bar */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Animated.View style={[styles.avatarPulse, pulseStyle]} />
                    <View style={styles.avatar}>
                        <Text style={styles.avatarEmoji}>🤖</Text>
                    </View>
                    <View style={styles.onlineBadge} />
                </View>
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.headerTitle}>Coach AI</Text>
                    <Text style={styles.headerSubtitle}>ONLINE</Text>
                </View>
            </View>

            {/* Messages List */}
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                style={styles.messagesContainer}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {messages.map(m => <ChatBubble key={m.id} message={m} />)}
                {isTyping && <TypingIndicator />}
            </ScrollView>

            {/* Input Zone */}
            {!isTyping && renderInputArea()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    avatarContainer: {
        position: 'relative',
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPulse: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#FF4500',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 20,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        backgroundColor: '#10B981',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#0A0A0A',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        maxHeight: '100%',
    },
    typingIndicator: {
        marginBottom: 16,
        marginLeft: 40,
        alignSelf: 'flex-start',
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 999,
        backgroundColor: '#888',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
        backgroundColor: '#0A0A0A',
        flexShrink: 0,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
        fontSize: 16,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    gradientSendButton: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        padding: 32,
        paddingBottom: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#1A1A1A',
        backgroundColor: '#0A0A0A',
    },
    loadingDot: {
        width: 12,
        height: 12,
        backgroundColor: '#FF4500',
        borderRadius: 999,
    },
    loadingText: {
        color: '#FF4500',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});
