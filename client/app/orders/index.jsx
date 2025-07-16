import { Feather } from "@expo/vector-icons";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import orders from "../../src/data/orderHistory";
import products from "../../src/data/products";
import { router } from "expo-router";

export default function OrdersScreen() {
  // Join product details into orders
  const enrichedOrders = orders.map((order) => {
    const product = products.find((p) => p.id === order.productId);
    return {
      ...order,
      product,
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-2">Order History</Text>
      </View>

      {enrichedOrders.length === 0 ? (
        <Text className="text-gray-500">No orders found.</Text>
      ) : (
        <FlatList
          data={enrichedOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row bg-gray-50 rounded-lg shadow-sm mb-3 p-3 items-center space-x-4">
              <Image
                source={{ uri: item.product.image }}
                className="w-16 h-16 rounded-lg"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base">
                  {item.product.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Qty: {item.quantity} • ₹{item.product.price}
                </Text>
                <Text className="text-xs text-gray-400">
                  Ordered on {item.date}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
