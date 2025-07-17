import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BillingSummary from "../../src/components/BillingSummary";
import AddressModal from "../../src/components/order/address";
import PaymentModal from "../../src/components/order/payment";
import { useCart } from "../../src/context/CartContext";
import { useUser } from "../../src/context/UserContext";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useUser();

  const cartItems = Object.values(cart);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [addressFields, setAddressFields] = useState(
    user.addresses?.[0] || {
      houseNumber: "",
      city: "",
      state: "",
      pincode: "",
    }
  );

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const isAddressComplete = ["houseNumber", "city", "state", "pincode"].every(
    (key) => String(addressFields[key] ?? "").trim() !== ""
  );

  const isReadyToPlace = isAddressComplete && selectedPayment;

  const handlePlaceOrder = () => {
    clearCart();
    setOrderPlaced(true);
  };

  const { selectedFromMap } = useLocalSearchParams();

  useEffect(() => {
    if (selectedFromMap) {
      try {
        const parsed = JSON.parse(selectedFromMap);
        if (parsed && parsed.pincode) {
          setAddressFields(parsed);
        }
      } catch (e) {
        console.warn("Failed to parse selected address from map");
      }
    }
  }, [selectedFromMap]);

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
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-4">
        <Text className="text-3xl font-bold">Checkout</Text>
      </View>

      {/* Order Summary Card */}
      <View className="mb-5">
        <Text className="text-2xl font-semibold mb-2 text-green-700">
          Order Summary
        </Text>
        <BillingSummary />
      </View>

      {/* Payment Summary Card */}
      <View className="pb-2 border-t pt-4 border-gray-200">
        <Text className="text-2xl font-semibold mb-5 text-green-700">
          Payment Method
        </Text>
        <PaymentModal
          visible={true}
          onClose={() => {}}
          selected={selectedPayment}
          setSelected={setSelectedPayment}
        />
      </View>

      {/* Address Summary Card */}
      <View className="mb-10 pt-4 border-t border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-semibold text-green-700">
            Delivering To
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedAddressIndex(0);
              setShowAddressModal(true);
            }}
          >
            <Text className="text-green-600 font-semibold text-xl">Edit</Text>
          </TouchableOpacity>
        </View>
        {isAddressComplete ? (
          <>
            <Text className="text-gray-700 text-lg">
              {addressFields.houseNumber}
            </Text>
            <Text className="text-gray-700 text-lg">
              {addressFields.city}, {addressFields.state} -{" "}
              {addressFields.pincode}
            </Text>
          </>
        ) : (
          <Text className="text-gray-500 italic">No address provided</Text>
        )}
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
        selectedAddressIndex={selectedAddressIndex}
        setSelectedAddressIndex={setSelectedAddressIndex}
      />
    </SafeAreaView>
  );
}
