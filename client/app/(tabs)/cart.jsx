import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItem from "../../src/components/CartItem";
import { useCart } from "../../src/context/CartContext";

export default function Cart() {
  const { cart } = useCart();
  const items = Object.values(cart);
  const router = useRouter();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal * 0.9;

  // Animated values
  const animatedSubtotal = useRef(new Animated.Value(0)).current;
  const animatedTotal = useRef(new Animated.Value(0)).current;

  // Number state to show
  const [displayedSubtotal, setDisplayedSubtotal] = useState(0);
  const [displayedTotal, setDisplayedTotal] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}

      <View className="flex-row items-center p-5">
        <Text className="text-3xl font-bold">Cart</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: items.length === 1 ? 70 : 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="justify-between min-h-full">
          {items.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg">Cart is empty</Text>
            </View>
          ) : (
            <View className="px-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </View>
          )}

          {/* Summary Card */}
          {items.length > 0 && (
            <View className="bg-gray-100 border border-gray-100 rounded-t-3xl mt-4 p-5 w-full">
              <View className="flex-row justify-between mb-2">
                <Text className="text-base text-gray-600">Subtotal</Text>
                <Text className="text-base text-gray-800">₹{subtotal}</Text>
              </View>

              {/* <View className="flex-row justify-between mb-2">
                <Text className="text-base text-gray-600">Discount</Text>
                <Text className="text-base text-red-500">10%</Text>
              </View>

              <View className="flex-row justify-between mb-4">
                <Text className="text-lg font-semibold">
                  Total ({items.length} items)
                </Text>
                <Text className="text-lg font-semibold text-green-600">
                  ₹{total}
                </Text>
              </View> */}

              <TouchableOpacity onPress={() => router.push("/checkout")}>
                <View className="bg-green-600 py-4 rounded-full items-center justify-center">
                  <Text className="text-white text-lg font-semibold">
                    Checkout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
