import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuantitySelector from "../../../src/components/QuantitySelector";
import products from "../../../src/data/products";

export default function ProductInfo() {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id === id);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-white p-4">
        <Image
          source={{ uri: product.image }}
          className="w-full h-80 mb-4"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold">{product.name}</Text>
        <Text className="text-gray-600 text-lg">{product.description}</Text>
        <Text className="text-lg my-2">₹{product.price}</Text>
        <QuantitySelector item={product} />
      </View>
    </SafeAreaView>
  );
}
