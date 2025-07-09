import { Feather } from "@expo/vector-icons";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import orders from "../../src/data/orderHistory";
import products from "../../src/data/products";
import user from "../../src/data/user.json";

export default function Profile() {
  // Get full product details for each order
  const enrichedOrders = orders.map((order) => {
    const product = products.find((p) => p.id === order.productId);
    return {
      ...order,
      product,
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 pt-4">
      <Text className="text-3xl font-bold text-gray-800 mb-4">Profile</Text>

      {/* Name Card */}
      <View className="bg-blue-50 p-4 rounded-lg mb-3 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <Feather name="user" size={22} color="#3B82F6" />
          <Text className="text-lg text-gray-800 font-medium">{user.name}</Text>
        </View>
      </View>

      {/* Phone Card */}
      <View className="bg-green-50 p-4 rounded-lg mb-3 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <Feather name="phone" size={22} color="#10B981" />
          <Text className="text-lg text-gray-800 font-medium">
            {user.phone}
          </Text>
        </View>
      </View>

      {/* Email Card */}
      <View className="bg-yellow-50 p-4 rounded-lg mb-5 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <Feather name="mail" size={22} color="#F59E0B" />
          <Text className="text-lg text-gray-800 font-medium">
            {user.email}
          </Text>
        </View>
      </View>

      {/* Order History */}
      <Text className="text-2xl font-semibold text-gray-800 mb-3">
        Order History
      </Text>

      {enrichedOrders.length === 0 ? (
        <Text className="text-gray-500">No orders found.</Text>
      ) : (
        <FlatList
          data={enrichedOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row bg-white rounded-lg shadow-sm mb-3 p-3 items-center space-x-4">
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
