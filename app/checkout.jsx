import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddressModal from "../src/components/order/address";
import PaymentModal from "../src/components/order/payment";
import { useCart } from "../src/context/CartContext";

export default function CheckoutScreen() {
  const router = useRouter();
  const { clearCart } = useCart();

  const [addressFields, setAddressFields] = useState({
    houseNumber: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const isAddressComplete = Object.values(addressFields).every(
    (val) => val.trim() !== ""
  );
  const isReadyToPlace = isAddressComplete && selectedPayment;

  const handlePlaceOrder = () => {
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-5">
        <Text className="text-4xl font-bold text-green-600 mb-3">
          🎉 Order Placed!
        </Text>
        <Text className="text-center text-gray-600 text-lg mb-6">
          Your order has been successfully placed.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="bg-green-500 py-3 px-10 rounded-full"
        >
          <Text className="text-white text-lg font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-5">Checkout</Text>

      {/* Address Summary Card */}
      <View className="mb-5 pb-2 border-b border-gray-200">
        <Text className="text-lg font-semibold mb-2">Delivery Address</Text>
        {isAddressComplete ? (
          <>
            <Text className="text-gray-700">{addressFields.houseNumber}</Text>
            <Text className="text-gray-700">
              {addressFields.city}, {addressFields.state} -{" "}
              {addressFields.pincode}
            </Text>
          </>
        ) : (
          <Text className="text-gray-500 italic">No address provided</Text>
        )}
        <TouchableOpacity
          onPress={() => setShowAddressModal(true)}
          className="mt-3"
        >
          <Text className="text-green-600 font-medium">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Summary Card */}
      <View className="mb-5 pb-2">
        <Text className="text-lg font-semibold mb-2">Payment Method</Text>
        {selectedPayment ? (
          <Text className="text-gray-700">{selectedPayment}</Text>
        ) : (
          <Text className="text-gray-500 italic">
            No payment method selected
          </Text>
        )}
        <TouchableOpacity
          onPress={() => setShowPaymentModal(true)}
          className="mt-3"
        >
          <Text className="text-green-600 font-medium">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Place Order Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-6 bg-gray-50">
        <TouchableOpacity
          disabled={!isReadyToPlace}
          onPress={handlePlaceOrder}
          className={`py-4 rounded-full items-center ${
            isReadyToPlace ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          <Text className="text-white text-lg font-semibold">Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addressFields={addressFields}
        setAddressFields={setAddressFields}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selected={selectedPayment}
        setSelected={setSelectedPayment}
      />
    </SafeAreaView>
  );
}
