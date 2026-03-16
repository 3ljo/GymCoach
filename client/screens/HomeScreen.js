import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <ScrollView className="flex-1 px-6 pt-16 pb-24">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-400 text-sm font-medium tracking-wide">THURSDAY, OCT 24</Text>
            <Text className="text-white text-3xl font-extrabold mt-1 tracking-tight">Hi, Alex!</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-[#1A1A1A] rounded-full items-center justify-center border border-[#333333]">
            <Ionicons name="person" size={24} color="#FF4500" />
          </TouchableOpacity>
        </View>

        {/* Activity Summary */}
        <View className="flex-row justify-between mb-8">
          <View className="bg-[#1A1A1A] rounded-3xl p-5 flex-1 mr-2 border border-[#333333] items-center shadow-lg">
            <View className="w-12 h-12 bg-[#FF4500]/20 rounded-full items-center justify-center mb-3">
              <Ionicons name="flame" size={24} color="#FF4500" />
            </View>
            <Text className="text-white text-2xl font-bold">450</Text>
            <Text className="text-gray-400 text-xs mt-1 font-semibold uppercase tracking-wider">Kcal Burned</Text>
          </View>
          <View className="bg-[#1A1A1A] rounded-3xl p-5 flex-1 ml-2 border border-[#333333] items-center shadow-lg">
            <View className="w-12 h-12 bg-[#FF8C00]/20 rounded-full items-center justify-center mb-3">
              <Ionicons name="time" size={24} color="#FF8C00" />
            </View>
            <Text className="text-white text-2xl font-bold">45m</Text>
            <Text className="text-gray-400 text-xs mt-1 font-semibold uppercase tracking-wider">Duration</Text>
          </View>
        </View>

        {/* Featured Workout */}
        <Text className="text-white text-xl font-bold mb-4 tracking-tight">Today's Plan</Text>
        <TouchableOpacity className="mb-8 rounded-3xl overflow-hidden">
          <LinearGradient
            colors={['#FF4500', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 h-48 justify-end"
          >
            <View className="bg-black/30 self-start px-3 py-1.5 rounded-full mb-3 border border-white/20">
              <Text className="text-white text-[10px] font-bold tracking-widest">UPPER BODY</Text>
            </View>
            <Text className="text-white text-3xl font-extrabold mb-1 tracking-tight">Chest & Triceps</Text>
            <Text className="text-white/90 font-medium tracking-wide">6 Exercises • 45 Min</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View className="flex-row justify-between items-end mb-4">
          <Text className="text-white text-xl font-bold tracking-tight">Weekly Progress</Text>
          <TouchableOpacity>
            <Text className="text-[#FF4500] text-sm font-bold tracking-wide">See All</Text>
          </TouchableOpacity>
        </View>
        
        <View className="bg-[#1A1A1A] rounded-3xl p-6 border border-[#333333] mb-12">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <View key={day} className="flex-row items-center mb-5 last:mb-0">
              <Text className="text-gray-400 w-10 font-bold">{day}</Text>
              <View className="flex-1 h-2.5 bg-[#333333] rounded-full mx-4 overflow-hidden">
                <View 
                  className="h-full bg-[#FF4500] rounded-full" 
                  style={{ width: `${i === 4 ? 0 : Math.random() * 50 + 40}%` }} 
                />
              </View>
              <Ionicons name="checkmark-circle" size={20} color={i < 4 ? "#FF4500" : "#333"} />
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-8 right-6 w-16 h-16 rounded-full items-center justify-center shadow-2xl"
        style={{ elevation: 10, shadowColor: '#FF4500', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 }}
      >
        <LinearGradient
          colors={['#FF4500', '#FF8C00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full rounded-full items-center justify-center"
        >
          <Ionicons name="play" size={28} color="white" style={{ marginLeft: 4 }} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
