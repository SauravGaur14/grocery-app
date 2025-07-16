import { Text, TouchableOpacity, View } from "react-native";

const methods = ["Cash on Delivery", "UPI", "Card"];

export default function PaymentModal({
  visible,
  onClose,
  selected,
  setSelected,
}) {
  return (
    <View className="">
      {/* <Text className="text-lg font-bold mb-4">Select Payment Method</Text> */}

      {methods.map((method, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => setSelected(method)}
          className={`p-4 border rounded-full mb-4 ${
            selected === method
              ? "border-green-500 bg-green-50"
              : "border-gray-300"
          }`}
        >
          <Text className="text-lg">{method}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
