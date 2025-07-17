import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE_URL } from "../../src/utils/config";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const router = useRouter();

  const isValidPhone = /^\d{10}$/.test(phone);

  const handleSendOtp = async () => {
    if (!agreed) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    if (!isValidPhone) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      console.log("sending otp");
      const response = await axios.post(`${API_BASE_URL}/send-otp`, {
        phone: `+91${phone}`,
      });
      console.log("otp sent");

      router.push({
        pathname: "/login/otp",
        params: {
          phone,
        },
      });
    } catch (err) {
      console.error("Failed to send OTP:", err.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 px-2 pt-10">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1">
          {/* Logo */}
          <View className="items-center mb-8">
            <Image
              source={require("../../assets/images/grocery1.png")}
              className="w-60 h-60"
              resizeMode="contain"
            />
          </View>

          {/* Heading Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-center text-green-600">
              Welcome
            </Text>
            <Text className="text-base text-center text-gray-500 mt-2">
              Enter your phone number to continue
            </Text>
          </View>

          {/* Form Card */}
          <View className="p-6">
            <Text className="text-base font-medium text-gray-700 mb-2">
              Phone Number
            </Text>

            <View
              className={`flex-row items-center rounded-full px-4 py-1 mb-4 border ${
                inputFocused ? "border-green-500" : "border-gray-300"
              }`}
            >
              <Ionicons name="call-outline" size={20} color="green" />
              <TextInput
                keyboardType="numeric"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="e.g. 9876543210"
                className="flex-1 ml-3 text-base text-gray-800"
              />
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              className="flex-row items-center my-5"
              onPress={() => setAgreed(!agreed)}
            >
              <View
                className={`w-5 h-5 rounded-full mr-3 border ${
                  agreed ? "bg-green-600 border-green-600" : "border-gray-400"
                } items-center justify-center`}
              >
                {agreed && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text className="text-sm text-gray-600">
                I agree to the{" "}
                <Text
                  className="text-blue-600 underline"
                  onPress={() => {
                    /* link */
                  }}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Pressable
              onPress={handleSendOtp}
              disabled={!isValidPhone}
              className={`py-4 rounded-full active:scale-95 ${
                isValidPhone ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Send OTP
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
