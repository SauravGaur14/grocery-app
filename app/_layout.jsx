import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import CartButton from "../src/components/CartButton";
import { CartProvider } from "../src/context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <View className="flex-1 bg-white relative">
        <StatusBar style="dark" />
        <Slot />
        <CartButton />
      </View>
    </CartProvider>
  );
}
