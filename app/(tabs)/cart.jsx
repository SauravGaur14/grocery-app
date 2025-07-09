import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantitySelector from "../../src/components/QuantitySelector";
import { useCart } from "../../src/context/CartContext";

export default function Cart() {
  const { cart } = useCart();
  const items = Object.values(cart);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
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
              <View className="bg-white p-4 mb-4 rounded-2xl">
                <View className="flex-row items-center justify-between w-full space-x-3">
                  <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-lg"
                    resizeMode="contain"
                  />

                  <View className="">
                    <Text className="text-lg font-semibold">{item.name}</Text>
                    <View className="flex flex-row items-center justify-between">
                      <Text className="text-gray-600 text-sm">
                        ₹{item.price} × {item.quantity} {" : "}
                      </Text>
                      <Text className="text-green-700 font-semibold text-base mt-1">
                        ₹{item.price * item.quantity}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end gap-5">
                    <QuantitySelector item={item} />
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 50 }}
          />

          <View className="absolute bottom-4 left-4 right-4">
            <View className="border-t border-gray-300 pt-4">
              <Text className="text-xl font-bold">
                Total: ₹
                {items.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )}
              </Text>
              <TouchableOpacity onPress={() => router.push("/order/address")}>
                <View className="mt-3 bg-green-500 py-3 rounded-full items-center">
                  <Text className="text-white text-lg font-semibold">
                    Proceed to Order
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
