import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import QuantitySelector from "./QuantitySelector";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity className="flex-1 m-2 bg-green-50 px-3 py-2 rounded-xl items-center text-center border border-gray-100 ">
        <Image
          source={{ uri: product.image }}
          className="w-28 h-28"
          resizeMode="contain"
        />
        <View className="flex w-full flex-row items-center justify-between">
          <Text className="font-bold text-xl text-left text-gray-700">
            {product.name}
          </Text>
          <Text className="text-lg text-gray-600">₹{product.price}</Text>
        </View>
        <QuantitySelector item={product} />
      </TouchableOpacity>
    </Link>
  );
}
