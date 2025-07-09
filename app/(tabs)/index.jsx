import { StatusBar } from "expo-status-bar";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import ProductCard from "../../src/components/ProductCard";
import products from "../../src/data/products";

export default function Home() {
  return (
    <SafeAreaView className="flex-1  bg-gray-100">
      <StatusBar style="dark" />
      <View className="flex-1 bg-gray-100">
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
