import { Slot } from "expo-router";
import { View } from "react-native";
import { CartProvider } from "../src/context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <View className="flex-1 bg-white">
        <Slot />
      </View>
    </CartProvider>
  );
}
