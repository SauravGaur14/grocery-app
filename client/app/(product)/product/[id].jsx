import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../../src/components/ProductCard";
import QuantitySelector from "../../../src/components/QuantitySelector";
import { useCart } from "../../../src/context/CartContext";
import products from "../../../src/data/products";

const { width } = Dimensions.get("window");

export default function ProductInfo() {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id === id);
  const navigation = useNavigation();

  const { addItem, cart } = useCart();
  const isInCart = !!cart[product.id];

  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [product.image, product.image, product.image]; // Placeholder

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleAddToCart = () => {
    addItem(product);
  };

  // Get 3 recommended products excluding the current one
  const recommended = products.filter((p) => p.id !== id).slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <View className="flex-row items-center mb-4 p-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Carousel */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              resizeMode="contain"
              style={{
                width: width,
                height: 220,
              }}
            />
          )}
        />

        {/* Dot indicators */}
        <View className="flex-row justify-center my-2 space-x-4">
          {images.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mr-2 ${
                currentIndex === index ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </View>

        {/* Product Info */}
        <View className="px-4 pt-2 space-y-2">
          <Text className="text-2xl font-bold text-gray-800">
            {product.name}
          </Text>

          <Text className="text-gray-600 text-base">{product.description}</Text>

          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-semibold text-green-700 mt-2">
              ₹{product.price}
            </Text>
            <View className="flex-row items-center mt-1 space-x-2">
              <Text className="text-lg text-gray-700">{product.rating}</Text>
              <Feather name="star" size={18} color="#facc15" />
            </View>
          </View>
        </View>

        {/* Recommended Products */}
        <View className="mt-10 px-4 border-t border-gray-200 pt-2">
          <Text className="text-2xl font-bold mb-2 text-gray-600">
            Recommended Products
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {recommended.map((item) => (
              <View key={item.id} className="w-[48%] mb-4">
                <ProductCard product={item} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Add to Cart or Quantity Selector */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-green-700">
          ₹{product.price}
        </Text>

        {!isInCart ? (
          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-green-600 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold text-lg">
              Add to Cart
            </Text>
          </TouchableOpacity>
        ) : (
          <QuantitySelector item={product} />
        )}
      </View>
    </SafeAreaView>
  );
}
