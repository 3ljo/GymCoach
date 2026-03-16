import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';

const AnimatedView = styled(Animated.View);

export default function SplashScreen({ navigation }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Pulse animation: fade in and scale up slightly
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSequence(
      withTiming(1.1, { duration: 600, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    );

    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="flex-1 bg-[#0A0A0A] items-center justify-center">
      <AnimatedView style={[animatedStyle]} className="items-center">
        <Ionicons name="barbell" size={64} color="#FF4500" />
        <Text className="text-white text-5xl font-bold tracking-widest mt-4">
          GYMCOACH
        </Text>
      </AnimatedView>
    </View>
  );
}
