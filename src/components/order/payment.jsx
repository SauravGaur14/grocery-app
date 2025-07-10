import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

const methods = ["Cash on Delivery", "UPI", "Card"];

export default function PaymentModal({
  visible,
  onClose,
  selected,
  setSelected,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-3xl p-5 pb-8">
          <Text className="text-xl font-bold mb-4">Choose Payment Method</Text>

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

          <TouchableOpacity
            disabled={!selected}
            onPress={onClose}
            className={`py-3 rounded-full items-center mt-2 ${
              selected ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Save Payment Method
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
