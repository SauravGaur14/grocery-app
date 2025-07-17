import { Text, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function BillingSummary() {
  const {
    getSubtotal,
    getTotalAmount,
    discountPercentage,
    deliveryCharges,
    platformFee,
  } = useCart();

  const subtotal = getSubtotal();
  const totalBeforeDiscount = subtotal + platformFee + deliveryCharges;
  const discountAmount = (totalBeforeDiscount * discountPercentage) / 100;
  const finalTotal = totalBeforeDiscount - discountAmount;

  return (
    <View>
      {/* Breakdown */}
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Subtotal</Text>
        <Text className="text-gray-800">₹{subtotal.toFixed(2)}</Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Platform Fee</Text>
        <Text className="text-gray-800">₹{platformFee.toFixed(2)}</Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Delivery Charges</Text>
        <Text className="text-gray-800">₹{deliveryCharges.toFixed(2)}</Text>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-100 my-4" />

      <View className="flex-row justify-between mb-2">
        <Text className="font-semibold text-gray-700">
          Total Before Discount
        </Text>
        <Text className="font-semibold text-gray-700">
          ₹{totalBeforeDiscount.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Discount ({discountPercentage}%)</Text>
        <Text className="text-red-500">- ₹{discountAmount.toFixed(2)}</Text>
      </View>

      {/* Final Total */}
      <View className="flex-row justify-between mt-4">
        <Text className="text-lg font-bold text-green-700">Total Payable</Text>
        <Text className="text-lg font-bold text-green-700">
          ₹{finalTotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
