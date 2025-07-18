import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { View } from "react-native";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // trigger navigation after animation
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <LottieView
        source={require("../../assets/ShoppingCart.json")}
        autoPlay
        loop
        style={{ width: 500, height: 500 }}
      />
    </View>
  );
}
