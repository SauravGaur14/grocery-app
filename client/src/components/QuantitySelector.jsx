import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function QuantitySelector({ item }) {
  const { cart, addItem, removeItem } = useCart();
  const quantity = cart[item.id]?.quantity || 0;

  return (
    <View className="flex-row items-center justify-between mt-3 gap-4 px-2 bg-gray-100 rounded-2xl">
      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        className="w-10 h-10 items-center justify-center rounded-full"
      >
        <Text className="text-red-500 text-xl">−</Text>
      </TouchableOpacity>

      <Text className="text-lg">{quantity}</Text>

      <TouchableOpacity
        onPress={() => addItem(item)}
        className="w-10 h-10 items-center justify-center rounded-full"
      >
        <Text className="text-green-500 text-xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}
