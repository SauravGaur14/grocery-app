import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import categories from "../../src/data/categories";

const numColumns = 2;
const cardSpacing = 16;
const containerPadding = 20 * 2; // p-5 = 20px left + 20px right
const screenWidth = Dimensions.get("window").width;
const cardWidth =
  (screenWidth - containerPadding - cardSpacing * (numColumns - 1)) /
  numColumns;

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-5">Categories</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        contentContainerStyle={{ gap: cardSpacing }}
        columnWrapperStyle={{ gap: cardSpacing, marginBottom: cardSpacing }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/category/${item.name}`)}
            style={{ width: cardWidth }}
            className="bg-white shadow border border-gray-100 rounded-xl p-4 items-center"
          >
            <Image
              source={{ uri: item.image }}
              className="w-40 h-40 mb-2"
              resizeMode="contain"
            />
            <Text className="text-green-800 font-semibold text-center">
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
