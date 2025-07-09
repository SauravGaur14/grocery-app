import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const methods = ["Cash on Delivery", "UPI", "Card"];

export default function PaymentScreen() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-white p-5">
        <Text className="text-2xl font-bold mb-4">Payment Method</Text>

        {methods.map((method, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelected(method)}
            className={`p-4 border rounded-full mb-4 ${
              selected === method
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
            }`}
          >
            <Text className="text-lg">{method}</Text>
          </TouchableOpacity>
        ))}

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-white">
          <TouchableOpacity
            disabled={!selected}
            onPress={() => router.push("/order/success")}
            className={`py-3 rounded-full items-center ${
              selected ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            <Text className="text-white text-lg font-semibold">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
