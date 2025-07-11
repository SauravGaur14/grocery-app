import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../src/components/ProductCard";
import products from "../../src/data/products";
export default function CategoryDetailScreen() {
  const { name } = useLocalSearchParams();
  const navigation = useNavigation();

  const filtered = products.filter((p) => p.category === name);

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/categories")}>
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-2">{name}</Text>
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <Text className="text-gray-500">
            No products found in this category.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
