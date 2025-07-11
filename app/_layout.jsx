import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import CartButton from "../src/components/CartButton";
import SplashScreen from "../src/components/SplashScreen";
import { CartProvider } from "../src/context/CartContext";
import { UserProvider } from "../src/context/UserContext";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <UserProvider>
      <CartProvider>
        <View className="flex-1 bg-white relative">
          <StatusBar style="dark" />
          <Slot />
          <CartButton />
        </View>
      </CartProvider>
    </UserProvider>
  );
}
