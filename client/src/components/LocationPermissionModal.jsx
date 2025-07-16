import {
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../context/UserContext";

export default function LocationPermissionModal({ visible }) {
  const { locationPermissionGranted, gpsEnabled, getLocation } = useUser();

  const openSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings();
    } else {
      Linking.openURL("App-Prefs:root=Privacy&path=LOCATION");
    }
  };

  let message = "";
  if (!locationPermissionGranted) {
    message =
      "Location permission is required to autofill your delivery address.";
  } else if (!gpsEnabled) {
    message =
      "Your device's GPS is turned off. Please enable it to detect your address.";
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        {/* Block dismiss outside press */}
        <Pressable className="flex-1" onPress={() => {}} />
        <View className="bg-white rounded-t-3xl p-5 pb-8 max-h-[85%]">
          <Text className="text-xl font-bold mb-4 text-gray-800">
            Location Required
          </Text>

          <Text className="text-gray-700 mb-6">{message}</Text>

          <TouchableOpacity
            onPress={openSettings}
            className="bg-blue-600 py-3 rounded-full items-center mb-3"
          >
            <Text className="text-white font-semibold text-base">
              Open Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getLocation}
            className="border border-gray-300 py-3 rounded-full items-center"
          >
            <Text className="text-gray-800 font-semibold text-base">
              Retry Location Access
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
