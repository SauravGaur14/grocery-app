import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantitySelector from "../../src/components/QuantitySelector";
import { useCart } from "../../src/context/CartContext";

export default function Cart() {
  const { cart } = useCart();
  const items = Object.values(cart);

  return (
   <SafeAreaView className="flex-1 bg-white">
  {items.length === 0 ? (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Cart is empty</Text>
    </View>
  ) : (
    <View className="flex-1 p-4">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 mb-4 rounded-xl">
            <View className="flex flex-row items-center justify-between w-full">
              <Text className="text-xl font-semibold">{item.name}</Text>
              <Text className="text-gray-600">
                ₹{item.price} × {item.quantity}
              </Text>
            </View>
            <View className="flex flex-row items-center justify-between w-full mt-2">
              <QuantitySelector item={item} />
              <Text className="text-base font-medium">
                ₹{item.price * item.quantity}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <View className="absolute bottom-4 left-4 right-4 bg-white">
        <View className="border-t border-gray-300 pt-4">
          <Text className="text-xl font-bold">
            Total: ₹
            {items.reduce((total, item) => total + item.price * item.quantity, 0)}
          </Text>

          <View className="mt-3 bg-green-500 py-3 rounded-full items-center">
            <Text className="text-white text-lg font-semibold">
              Proceed to Order
            </Text>
          </View>
        </View>
      </View>
    </View>
  )}
</SafeAreaView>

  );
}
