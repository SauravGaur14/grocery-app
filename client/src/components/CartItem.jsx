import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import QuantitySelector from "./QuantitySelector";

export default function CartItem({ item }) {
  const animatedSubtotal = useRef(
    new Animated.Value(item.price * item.quantity)
  ).current;
  const [displayedSubtotal, setDisplayedSubtotal] = useState(
    item.price * item.quantity
  );

  useEffect(() => {
    Animated.timing(animatedSubtotal, {
      toValue: item.price * item.quantity,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [item.quantity]);

  useEffect(() => {
    const listener = animatedSubtotal.addListener(({ value }) => {
      setDisplayedSubtotal(value.toFixed(2));
    });

    return () => {
      animatedSubtotal.removeListener(listener);
    };
  }, []);

  return (
    <View className="bg-green-50 border border-[#e7f4ffb1] px-2 py-1 mb-4 rounded-3xl">
      <View className="flex-row space-x-4">
        {/* Product Image */}
        <Image
          source={{ uri: item.image }}
          className="w-32 h-32"
          resizeMode="contain"
        />

        {/* Product Info */}
        <View className="flex-1 justify-between py-1 ml-4">
          {/* Top section: name + price */}
          <View className="flex-row items-center justify-between">
            <Text
              className="text-xl font-semibold text-gray-700"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text className="text-gray-600 text-lg">₹{item.price}</Text>
          </View>

          {/* Bottom section: subtotal + quantity */}
          <View className="flex-row items-baseline justify-between mt-4">
            <Text className="text-xl font-semibold text-green-700">
              ₹{displayedSubtotal}
            </Text>
            <View className="max-w-28">
              <QuantitySelector item={item} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
