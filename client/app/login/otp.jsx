import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "../../src/context/UserContext";

import { API_BASE_URL } from "../../src/utils/config";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams();
  const { login } = useUser();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  if (!phone) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-white">
        <Text className="text-red-500 text-lg font-semibold text-center">
          Invalid phone number. Please go back and try again.
        </Text>
      </View>
    );
  }

  const handleVerify = async () => {
    if (otp.trim().length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      console.log("trying to verify otp", otp);
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        phone: `+91${phone}`,
        otp: otp.trim(),
      });
      console.log("req sent respons recieved");
      if (response.data.success) {
        await login(`+91${phone}`);
        router.replace("/");
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.warn("OTP verification failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-6">
        {/* Heading */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-green-600">
            Verify OTP
          </Text>
          <Text className="text-base text-center text-gray-500 mt-2">
            Enter the 6-digit OTP sent to{" "}
            <Text className="font-semibold text-gray-700">{phone}</Text>
          </Text>
        </View>

        {/* Card Container */}
        <View className="">
          <TextInput
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Enter 6-digit OTP"
            className={`text-base px-4 py-3 rounded-full border mb-4 ${
              inputFocused ? "border-green-500" : "border-gray-300"
            } text-gray-800`}
          />

          <Pressable
            onPress={handleVerify}
            disabled={otp.trim().length !== 6}
            className={`py-4 rounded-full active:scale-95 ${
              otp.trim().length === 6 ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Verify OTP
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
