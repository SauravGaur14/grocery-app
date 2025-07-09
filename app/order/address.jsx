import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressScreen() {
  const router = useRouter();
  const [addressFields, setAddressFields] = useState({
    houseNumber: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (key, value) => {
    setAddressFields((prev) => ({ ...prev, [key]: value }));
  };

  const isFormComplete = Object.values(addressFields).every(
    (val) => val.trim() !== ""
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold mb-4">Delivery Address</Text>
        <View className="flex w-full">
          <TextInput
            className="border border-gray-300 p-3 rounded-full mb-4"
            placeholder="House / Flat No."
            value={addressFields.houseNumber}
            onChangeText={(val) => handleChange("houseNumber", val)}
          />

          <TextInput
            className="border border-gray-300 p-3 rounded-full mb-4"
            placeholder="Locality"
            value={addressFields.locality}
            onChangeText={(val) => handleChange("locality", val)}
          />
          <TextInput
            className="border border-gray-300 p-3 rounded-full mb-4"
            placeholder="City"
            value={addressFields.city}
            onChangeText={(val) => handleChange("city", val)}
          />
          <TextInput
            className="border border-gray-300 p-3 rounded-full mb-4"
            placeholder="State"
            value={addressFields.state}
            onChangeText={(val) => handleChange("state", val)}
          />
          <TextInput
            className="border border-gray-300 p-3 rounded-full mb-4"
            placeholder="Pincode"
            keyboardType="numeric"
            maxLength={6}
            value={addressFields.pincode}
            onChangeText={(val) => handleChange("pincode", val)}
          />
        </View>
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-white">
          <TouchableOpacity
            disabled={!isFormComplete}
            onPress={() => router.push("/order/payment")}
            className={`py-3 rounded-full items-center ${
              isFormComplete ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            <Text className="text-white text-lg font-semibold">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
