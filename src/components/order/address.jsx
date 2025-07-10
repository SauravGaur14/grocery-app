import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddressModal({
  visible,
  onClose,
  addressFields,
  setAddressFields,
}) {
  const handleChange = (key, value) => {
    setAddressFields((prev) => ({ ...prev, [key]: value }));
  };

  const isFormComplete = ["houseNumber", "city", "state", "pincode"].every(
    (key) => addressFields[key]?.trim() !== ""
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
      <View className="bg-white rounded-t-3xl p-5 pb-8">
          <Text className="text-xl font-bold mb-4">Edit Delivery Address</Text>

          {["houseNumber", "city", "state", "pincode"].map((key, index) => (
            <TextInput
              key={index}
              className="border border-gray-300 p-3 rounded-full mb-4"
              placeholder={
                key === "houseNumber"
                  ? "House / Flat No."
                  : key.charAt(0).toUpperCase() + key.slice(1)
              }
              keyboardType={key === "pincode" ? "numeric" : "default"}
              maxLength={key === "pincode" ? 6 : undefined}
              value={addressFields[key]}
              onChangeText={(val) => handleChange(key, val)}
            />
          ))}

          <TouchableOpacity
            disabled={!isFormComplete}
            onPress={onClose}
            className={`py-3 rounded-full items-center mt-2 ${
              isFormComplete ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Save Address
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
