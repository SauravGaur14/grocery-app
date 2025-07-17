import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function QuantitySelector({ item }) {
  const { cart, addItem, removeItem } = useCart();
  const quantity = cart[item.id]?.quantity || 0;

  return (
    <View className="flex-row items-center justify-between mt-3 gap-4 p-1 bg-gray-50 rounded-2xl w-full">
      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        className="w-8 h-8 items-center justify-center rounded-xl bg-gray-100"
      >
        <Text className="text-red-500 text-xl">−</Text>
      </TouchableOpacity>

      <Text className="text-lg">{quantity}</Text>

      <TouchableOpacity
        onPress={() => addItem(item)}
        className="w-8 h-8 items-center justify-center rounded-xl bg-gray-100"
      >
        <Text className="text-green-500 text-xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}
