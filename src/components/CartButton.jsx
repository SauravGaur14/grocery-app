import Feather from "@expo/vector-icons/Feather";
import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";
export default function CartButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCart();

  const cartItems = Object.values(cart);

  // Hide if no items or on certain routes
  if (cartItems.length === 0) return null;
  const hiddenRoutes = [
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/mapPicker",
  ];
  if (hiddenRoutes.includes(pathname)) return null;

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View className="absolute bottom-24 left-0 right-0 items-center z-50">
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        className="bg-green-500 px-5 py-3 rounded-full items-center shadow-lg"
      >
        <View className="text-white font-semibold text-base flex-row items-center justify-between">
          <View>
            <Text className="text-white font-semibold text-lg">View Cart</Text>
            <Text className="text-white font-semibold text-sm">
              {totalQty} item{totalQty > 1 ? "s" : ""}
            </Text>
          </View>
          <View className="bg-green-600 rounded-full w-12 h-12 items-center justify-center ml-10">
            <Feather name="chevron-right" size={26} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
