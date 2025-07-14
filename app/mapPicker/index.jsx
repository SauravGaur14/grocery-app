import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useUser } from "../../src/context/UserContext";
export default function MapPicker() {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const mapRef = useRef(null);

  const router = useRouter();
  const { addAddress } = useUser();

  // Initial location fetch
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = location.coords;

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

  const handleConfirm = () => {
    if (address) {
      const added = addAddress(address);
      if (added) {
        router.replace({
          pathname: "/checkout",
          params: {
            selectedFromMap: JSON.stringify(added), // pass the new address back
          },
        });
      } else {
        router.back();
      }
    }
  };

  if (loading || !region) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
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
          <Text className="text-white font-semibold">Use This Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
