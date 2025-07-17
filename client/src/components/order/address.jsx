import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";

export default function AddressModal({
  visible,
  onClose,
  addressFields,
  setAddressFields,
  selectedAddressIndex,
  setSelectedAddressIndex,
}) {
  const { user, addAddress, updateAddress } = useUser();

  const isFormComplete = ["houseNumber", "city", "state", "pincode"].every(
    (key) => String(addressFields[key] ?? "").trim() !== ""
  );

  const router = useRouter();

  useEffect(() => {
    if (visible) {
      if (user.addresses.length > 0) {
        const latest = user.addresses[user.addresses.length - 1];
        setAddressFields(latest);
        setSelectedAddressIndex(user.addresses.length - 1);
      } else {
        resetForm();
      }
    }
  }, [visible]);

  const handleOpenMap = () => {
    router.push({
      pathname: "/mapPicker",
      params: {
        latitude: addressFields?.latitude ?? "",
        longitude: addressFields?.longitude ?? "",
         index: selectedAddressIndex ?? "",
      },
    });
  };

  const handleChange = (key, value) => {
    setAddressFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (
      addressFields.houseNumber &&
      addressFields.city &&
      addressFields.state &&
      addressFields.pincode
    ) {
      let result;
      if (
        selectedAddressIndex != null &&
        user.addresses[selectedAddressIndex]
      ) {
        result = await updateAddress(selectedAddressIndex, addressFields);
      } else {
        result = await addAddress(addressFields);
      }

      if (result) {
        setAddressFields(result);
        setSelectedAddressIndex(user.addresses.length);
        onClose();
      } else {
        alert("Failed to save address.");
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  const resetForm = () => {
    setAddressFields({
      houseNumber: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

  useEffect(() => {
    if (visible) {
      // Reset to first address or clear form
      if (user.addresses.length > 0) {
        const address = user.addresses[selectedAddressIndex];
        if (address) setAddressFields(address);
      } else {
        resetForm();
      }
    }
  }, [visible, selectedAddressIndex]);

  // Combine saved addresses + Add New button
  // const addressList = [...user.addresses];
  const addressList = [...user.addresses, { isAddNew: true }];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white rounded-t-3xl p-5 pb-8 max-h-[85%]">
          <View className="flex-row items-center justify-between mb-4 ">
            <Text className="text-xl font-bold">
              {user.addresses.length > 0
                ? "Edit Delivery Address"
                : "Add Address"}
            </Text>
            <TouchableOpacity
              onPress={handleOpenMap}
              className="bg-blue-500 rounded-full p-3 items-center"
            >
              <Text className="text-white font-semibold">Pick from Map</Text>
            </TouchableOpacity>
          </View>

          {/* Address Pills */}
          {user.addresses.length > 0 && (
            <FlatList
              data={addressList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{ marginBottom: 16 }}
              renderItem={({ item, index }) => {
                if (item.isAddNew) {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        resetForm();
                        setSelectedAddressIndex(index);
                      }}
                      className="flex-row items-center px-4 py-2 rounded-full border bg-blue-100 border-blue-300 mr-2"
                    >
                      <Feather name="plus" size={16} color="#2563EB" />
                      <Text className="ml-2 text-blue-600 font-medium">
                        Add New
                      </Text>
                    </TouchableOpacity>
                  );
                }

                const isSelected = index === selectedAddressIndex;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedAddressIndex(index)}
                    className={`px-4 py-2 rounded-full border ${
                      isSelected
                        ? "bg-green-500 border-green-600"
                        : "bg-gray-200"
                    } mr-2`}
                  >
                    <Text className={isSelected ? "text-white" : "text-black"}>
                      {item.houseNumber}, {item.city}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* Address Form */}
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

          {/* Save Button */}
          <TouchableOpacity
            disabled={!isFormComplete}
            onPress={handleSave}
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
