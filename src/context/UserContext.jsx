import * as Location from "expo-location";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "John",
    email: "john@gmail.com",
    phone: "+91 7010101010",
    addresses: [],
  });

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted.");
        Alert.alert(
          "Permission Denied",
          "Please allow location permission in settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocoded = await Location.reverseGeocodeAsync(location.coords);

      if (geocoded.length > 0) {
        const { name, city, region, postalCode } = geocoded[0];

        const formattedAddress = {
          houseNumber: name || "N/A",
          city: city || "Unknown City",
          state: region || "Unknown State",
          pincode: postalCode || "000000",
        };

        setUser((prev) => ({
          ...prev,
          addresses: [formattedAddress, ...prev.addresses],
        }));
      }
    } catch (error) {
      if (
        error?.message?.includes("unsatisfied device settings") ||
        error?.message?.includes("Location request failed")
      ) {
        Alert.alert(
          "Enable GPS",
          "Please turn on your device's GPS/location services and try again.",
          [
            {
              text: "Retry",
              onPress: getLocation, // Retry getting location
            },
            Platform.OS === "android"
              ? {
                  text: "Settings",
                  onPress: () => Linking.openSettings(), //  Open system settings
                }
              : null,
            { text: "Cancel", style: "cancel" },
          ].filter(Boolean) //  filters out `null` on iOS
        );
      } else {
        Alert.alert("Location Error", "Failed to get your location.");
      }

      console.error("Error getting user location:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const addAddress = (addressObj) => {
    if (
      addressObj &&
      addressObj.houseNumber &&
      addressObj.city &&
      addressObj.state &&
      addressObj.pincode
    ) {
      setUser((prev) => ({
        ...prev,
        addresses: [...prev.addresses, addressObj],
      }));
    } else {
      console.warn("Invalid address object passed to addAddress.");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, addAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
