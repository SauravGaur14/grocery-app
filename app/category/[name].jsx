import { useLocalSearchParams } from "expo-router";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../src/components/ProductCard";
import products from "../../src/data/products";

export default function CategoryDetailScreen() {
  const { name } = useLocalSearchParams();

  const filtered = products.filter((p) => p.category === name);

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4">{name}</Text>

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
