import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import QuantitySelector from "./QuantitySelector";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity className="flex-1 m-2 bg-white p-3 rounded-xl shadow items-center text-center border border-gray-100 ">
        <View className="flex w-full flex-row items-center justify-between">
          <Text className="font-bold text-2xl text-left">{product.name}</Text>
          <Text>₹{product.price}</Text>
        </View>
        <Image
          source={{ uri: product.image }}
          className="w-32 h-32"
          resizeMode="contain"
        />
        {/* <View className="">
          <Text className="text-gray-500 text-base">{product.description}</Text>
        </View> */}
        <QuantitySelector item={product} />
      </TouchableOpacity>
    </Link>
  );
}
