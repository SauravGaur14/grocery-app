import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import ProductCard from "../../src/components/ProductCard";
import { useUser } from "../../src/context/UserContext";
import products from "../../src/data/products";

export default function Home() {
  const { user } = useUser();
  return (
    <SafeAreaView className="flex-1  bg-white">
      <StatusBar style="dark" />
      <Text className="text-2xl font-bold px-5 my-4 text-green-700">
        Welcome, {user.name || "Guest"}
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
    </SafeAreaView>
  );
}
