import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import { LOCATIONIQ_KEY } from "../../src/utils/config";

export default function MapPicker() {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const mapRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { latitude, longitude, index } = useLocalSearchParams();
  const parsedIndex = index !== undefined ? parseInt(index, 10) : null;

  const router = useRouter();
  const { user, addAddress, updateAddress } = useUser();

  // Initial location fetch
  useEffect(() => {
    (async () => {
      let coords;

      if (latitude && longitude) {
        coords = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        coords = location.coords;
      }

      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setMarker(coords);
      fetchAddress(coords);
      setLoading(false);
    })();
  }, []);

  const fetchAddress = async (coords) => {
    setAddress(null);
    setAddressLoading(true);
    try {
      const geocoded = await Location.reverseGeocodeAsync(coords);
      if (geocoded.length > 0) {
        const { name, city, region, postalCode } = geocoded[0];
        const formatted = {
          houseNumber: name || "",
          city: city || "",
          state: region || "",
          pincode: postalCode || "",
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setAddress(formatted);
      } else {
        setAddress(null);
      }
    } catch (err) {
      setAddress(null);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleRecenter = async () => {
    try {
      setAddressLoading(true);
      //   console.log("handle recenter clicked", new Date().toISOString());
      const location = await Location.getCurrentPositionAsync({});
      const coords = location.coords;

      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      //   console.log("Setting markers", new Date().toISOString());
      setMarker(coords);
      //   console.log("Marker set", new Date().toISOString());
      fetchAddress(coords);
      //   console.log("Adress fetched", new Date().toISOString());

      // Animate map
      if (mapRef.current) {
        // console.log("animating the region to current locations",new Date().toISOString());
        mapRef.current.animateToRegion(newRegion, 500);
        // console.log("animated to region", new Date().toISOString());
      }
    } catch (error) {
      alert("Failed to get current location.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      if (address) {
        let result;
        if (
          parsedIndex != null &&
          !isNaN(parsedIndex) &&
          user?.addresses?.[parsedIndex]
        ) {
          result = await updateAddress(parsedIndex, address);
        } else {
          result = await addAddress(address);
        }

        if (result) {
          router.replace({
            pathname: "/checkout",
            params: {
              selectedFromMap: JSON.stringify(result),
            },
          });
        } else {
          router.back();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestions = async (text) => {
    try {
      const res = await axios.get(
        `https://api.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: LOCATIONIQ_KEY,
            q: text,
            format: "json",
          },
        }
      );

      // setSuggestions(res.data);
      setSuggestions(
        res.data.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.place_id === item.place_id &&
                t.lat === item.lat &&
                t.lon === item.lon
            )
        )
      );
    } catch (error) {
      console.warn("Autocomplete error", error);
    }
  };

  const handleSelectSuggestion = (item) => {
    Keyboard.dismiss();
    setSuggestions([]);
    setQuery("");

    const coords = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    };

    setMarker(coords);
    fetchAddress(coords);

    const newRegion = {
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 3) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 1000); // wait 1s after user stops typing

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (loading || !region) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setSuggestions([]);
        }}
      >
        <View className="flex-1">
          <View className="absolute top-5 w-full px-4 z-10">
            <View className="flex-row items-center bg-white rounded-full shadow px-4 py-3 border border-gray-200">
              <Feather name="search" size={20} color="gray" />
              <TextInput
                className="flex-1 ml-2"
                placeholder="Search location..."
                value={query}
                onChangeText={(text) => setQuery(text)}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Feather name="x" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>

            {suggestions.length > 0 && (
              <View className="bg-white rounded-xl mt-2 max-h-60 overflow-hidden shadow-lg">
                <FlatList
                  data={suggestions}
                  keyExtractor={(item, index) =>
                    `${item.place_id ?? ""}-${item.osm_id ?? ""}-${index}`
                  }
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 240 }} // same as max-h-60
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-3 border-b border-gray-100"
                      onPress={() => handleSelectSuggestion(item)}
                    >
                      <Text className="text-gray-700">{item.display_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={region}
            onPress={(e) => {
              const coords = e.nativeEvent.coordinate;
              setMarker(coords);
              fetchAddress(coords);
            }}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>

          <TouchableOpacity
            onPress={handleRecenter}
            className="absolute bottom-40 right-7 bg-white p-3 rounded-full shadow"
          >
            <Feather name="crosshair" size={32} color="black" />
          </TouchableOpacity>

          <View className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-200">
            {addressLoading ? (
              <Text className="text-gray-500 mb-2">Fetching address...</Text>
            ) : address ? (
              <Text className="text-center font-semibold mb-2">
                {address.houseNumber}, {address.city}, {address.state} -{" "}
                {address.pincode}
              </Text>
            ) : (
              <Text className="text-red-500 text-center mb-2">
                Unable to fetch address
              </Text>
            )}

            <TouchableOpacity
              disabled={!address || addressLoading}
              onPress={handleConfirm}
              className={`py-3 rounded-full items-center ${
                address ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <Text className="text-white font-semibold">
                Use This Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
