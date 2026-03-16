import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { mockSocialAuth } from '../utils/auth';

// For production OAuth, uncomment these:
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// WebBrowser.maybeCompleteAuthSession();

const AnimatedView = styled(Animated.View);

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error state
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Google OAuth (currently using mock auth, uncomment when ready for production)
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  // });

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     handleSocialAuthSuccess('google', authentication);
  //   }
  // }, [response]);

  // Animation values
  const indicatorPosition = useSharedValue(0); // 0 for Login, 1 for Register

  const handleToggle = (toLogin) => {
    setError(''); // clear errors on toggle
    setIsLogin(toLogin);
    indicatorPosition.value = withTiming(toLogin ? 0 : 1, { duration: 300, easing: Easing.inOut(Easing.ease) });
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value * 160 }],
    };
  });

  const handleSubmit = () => {
    setError('');
    if (isLogin) {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      navigation.replace('Home');
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      navigation.replace('Onboarding');
    }
  };

  const handleSocialAuthSuccess = async (provider, authData) => {
    console.log(`${provider} auth success:`, authData);
    setIsAuthenticating(false);
    // For now, new social users go to onboarding
    navigation.replace('Onboarding');
  };

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setError('');

    // Use mock auth for development (instant redirect)
    // Replace with real OAuth when you have credentials set up
    try {
      const result = await mockSocialAuth('Google');
      if (result.success) {
        handleSocialAuthSuccess('Google', result.user);
      }
    } catch (e) {
      setError('Google sign in failed. Please try again.');
      setIsAuthenticating(false);
    }

    // Uncomment this when you have real Google OAuth credentials:
    // promptAsync();
  };

  const handleAppleSignIn = async () => {
    setIsAuthenticating(true);
    setError('');

    // Use mock auth for development (instant redirect)
    try {
      const result = await mockSocialAuth('Apple');
      if (result.success) {
        handleSocialAuthSuccess('Apple', result.user);
      }
    } catch (e) {
      setError('Apple sign in failed. Please try again.');
      setIsAuthenticating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="barbell" size={56} color="#FF4500" />
          </View>
          <Text style={styles.title}>GYMCOACH</Text>
          <Text style={styles.subtitle}>Your AI Personal Trainer</Text>
          <Text style={styles.description}>Programs built for you. Updated every week.</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <Animated.View style={[styles.tabIndicator, indicatorStyle]} />

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleToggle(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleToggle(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>REGISTER</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#666"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF4500', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.submitButtonText}>
                {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButtonGoogle}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="logo-google" size={22} color="#000" style={styles.socialIcon} />
                <Text style={styles.socialButtonTextGoogle}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButtonApple}
            onPress={handleAppleSignIn}
            activeOpacity={0.8}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="logo-apple" size={22} color="#FFF" style={styles.socialIcon} />
                <Text style={styles.socialButtonTextApple}>Continue with Apple</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 9999,
    padding: 4,
    marginBottom: 32,
    position: 'relative',
    alignSelf: 'center',
    width: 320,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    width: 152,
    backgroundColor: '#FF4500',
    borderRadius: 9999,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: '#999',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  socialContainer: {
    gap: 12,
  },
  socialButtonGoogle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  socialButtonApple: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonTextGoogle: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  socialButtonTextApple: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
