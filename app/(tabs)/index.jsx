import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import LocationPermissionModal from "../../src/components/LocationPermissionModal";
import ProductCard from "../../src/components/ProductCard";
import { useUser } from "../../src/context/UserContext";
import products from "../../src/data/products";

export default function Home() {
  const { user, locationPermissionGranted, gpsEnabled } = useUser();
  const currentAddress = user.addresses[0];

  return (
    <SafeAreaView className="flex-1  bg-white">
      <StatusBar style="dark" />
      <Text className="text-base font-medium px-5 mt-4 text-gray-500">
        Delivering to:
      </Text>
      <Text className="text-sm font-bold px-5 mb-4 text-green-700">
        {currentAddress
          ? `${currentAddress.houseNumber}, ${currentAddress.city}, ${currentAddress.state}`
          : "Fetching your location..."}
      </Text>

      <View className="flex-1 bg-white">
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        />
      </View>
      <LocationPermissionModal
        visible={!locationPermissionGranted || !gpsEnabled}
      />
    </SafeAreaView>
  );
}
