import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../../context/CartContext";

export default function SuccessScreen() {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-4xl font-bold text-green-600 mb-3">
        🎉 Order Placed!
      </Text>
      <Text className="text-center text-gray-600 text-lg mb-6">
        Your order has been successfully placed.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="bg-green-500 py-3 px-10 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
