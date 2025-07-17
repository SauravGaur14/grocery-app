import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import LocationPermissionModal from "../../src/components/LocationPermissionModal";
import ProductCard from "../../src/components/ProductCard";
import { useUser } from "../../src/context/UserContext";
import categories from "../../src/data/categories";
import products from "../../src/data/products";

export default function Home() {
  const { user, locationPermissionGranted, gpsEnabled } = useUser();
  const currentAddress = user?.addresses?.[0];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {/* Delivering to */}
        <View className="px-5 mt-4 mb-2">
          <Text className="text-base font-medium text-gray-500">
            Delivering to:
          </Text>
          <Text className="text-sm font-bold text-green-700">
            {user && currentAddress
              ? `${currentAddress.houseNumber}, ${currentAddress.city}, ${currentAddress.state}`
              : "Fetching your location..."}
          </Text>
        </View>
        {/* Offer Card */}
        <View className="mx-5 rounded-xl h-52 border border-gray-100 overflow-hidden">
          <Image
            source={{
              uri: "https://s.tmimgcdn.com/scr/800x500/252400/umbrella-monsoon-sale-vector_252406-original.png",
            }}
            className="w-full h-32"
            resizeMode="cover"
          />
          <View className="bg-green-50 p-3 rounded-xl mt-1">
            <Text className="text-gray-600 text-xl font-bold">
              Monsoon Offer
            </Text>
            <Text className="text-gray-600 text-base">
              Upto 30% Off on selected products
            </Text>
          </View>
        </View>

        {/* Categories Header */}
        <View className="flex-row justify-between items-center px-5 mb-2 mt-10">
          <Text className="text-xl font-bold">Categories</Text>
          <Text className="text-base text-green-600 font-medium">See All</Text>
        </View>

        {/* Categories List */}
        <View className="px-5 flex-row mb-4">
          {categories.map((category, idx) => (
            <View key={idx} className="items-center mr-4 w-16">
              <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                <Image
                  source={{ uri: category.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs text-center mt-1">{category.name}</Text>
            </View>
          ))}
        </View>

        {/* Products Header */}
        <View className="flex-row justify-between items-center px-5 mb-2 mt-10">
          <Text className="text-xl font-bold">Products</Text>
          <Text className="text-base text-green-600 font-medium">See All</Text>
        </View>
        {/* Products List */}
        <View className="flex-row flex-wrap justify-between px-3">
          {products.map((item) => (
            <View key={item.id} className="w-[50%]">
              <ProductCard product={item} />
            </View>
          ))}
        </View>
      </ScrollView>

      <LocationPermissionModal
        visible={!locationPermissionGranted || !gpsEnabled}
      />
    </SafeAreaView>
  );
}
