import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const segments = useSegments();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);

  const isLoginRoute = segments[0] === "login";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("auth");
        const parsed = storedAuth ? JSON.parse(storedAuth) : null;

        if (parsed?.phone) {
          setUser({
            name: "John Doe",
            email: "user@ex.com",
            phone: parsed.phone,
            addresses: [],
          });
        } else if (!isLoginRoute) {
          router.replace("/login");
        }
      } catch (e) {
        console.warn("Failed to load auth from storage", e);
        if (!isLoginRoute) router.replace("/login");
      } finally {
        setCheckingAuth(false); // ✅ done checking
      }
    };

    checkAuth();
  }, [isLoginRoute]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationPermissionGranted(false);
        setGpsEnabled(false); // can't get location
        return;
      }

      setLocationPermissionGranted(true);

      const location = await Location.getCurrentPositionAsync({});
      setGpsEnabled(true); // successfully got location

      const geocoded = await Location.reverseGeocodeAsync(location.coords);

      if (geocoded.length > 0) {
        const { name, city, region, postalCode } = geocoded[0];

        const formattedAddress = {
          houseNumber: name || "N/A",
          city: city || "Unknown City",
          state: region || "Unknown State",
          pincode: postalCode || "000000",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUser((prev) => ({
          ...prev,
          addresses: [formattedAddress, ...prev.addresses],
        }));
      }
    } catch (error) {
      setGpsEnabled(false);
    }
  };

  useEffect(() => {
    if (user?.phone && !hasFetchedLocation) {
      getLocation();
      setHasFetchedLocation(true);
    }
  }, [user?.phone, hasFetchedLocation]);

  const addAddress = async (addressObj) => {
    const isValid =
      addressObj &&
      addressObj.houseNumber &&
      addressObj.city &&
      addressObj.state &&
      addressObj.pincode;

    if (!isValid) {
      console.warn("Invalid address object passed to addAddress.");
      return null;
    }

    let finalAddress = { ...addressObj };

    // If lat/lng are missing, geocode the address
    if (!finalAddress.latitude || !finalAddress.longitude) {
      try {
        const [location] = await Location.geocodeAsync(
          `${finalAddress.houseNumber}, ${finalAddress.city}, ${finalAddress.state}, ${finalAddress.pincode}`
        );

        if (!location) {
          console.warn("Geocoding failed — could not fetch coordinates.");
          return null;
        }

        finalAddress.latitude = location.latitude;
        finalAddress.longitude = location.longitude;
      } catch (err) {
        console.error("Geocoding error:", err);
        return null;
      }
    }

    setUser((prev) => {
      const alreadyExists = prev.addresses.some(
        (addr) =>
          addr.latitude === finalAddress.latitude &&
          addr.longitude === finalAddress.longitude
      );

      const updated = {
        ...prev,
        addresses: alreadyExists
          ? prev.addresses
          : [...prev.addresses, finalAddress],
      };

      return updated;
    });

    return finalAddress;
  };

  const updateAddress = async (index, updatedFields) => {
    if (!user || !user.addresses[index]) {
      console.warn("Invalid address index");
      return;
    }

    const current = user.addresses[index];

    // Merge the updated fields with the current address
    const merged = {
      ...current,
      ...updatedFields,
    };

    // Always re-geocode the updated address to get fresh coordinates
    try {
      const [location] = await Location.geocodeAsync(
        `${merged.houseNumber}, ${merged.city}, ${merged.state}, ${merged.pincode}`
      );

      if (!location) {
        console.warn("Failed to geocode updated address");
        return;
      }

      merged.latitude = location.latitude;
      merged.longitude = location.longitude;

      // Update user state with new address
      setUser((prev) => {
        const newAddresses = [...prev.addresses];
        newAddresses[index] = merged;

        return {
          ...prev,
          addresses: newAddresses,
        };
      });

      return merged;
    } catch (err) {
      console.error("Geocoding failed during address update:", err);
      return;
    }
  };

  const login = async (phoneNumber) => {
    const authData = { phone: phoneNumber };
    await AsyncStorage.setItem("auth", JSON.stringify(authData));
    setUser({
      name: "Mock User",
      email: "user@example.com",
      phone: phoneNumber,
      addresses: [],
    });
    router.replace("/");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth");
    setUser(null);
    router.replace("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        addAddress,
        updateAddress,
        login,
        logout,
        locationPermissionGranted,
        gpsEnabled,
        getLocation,
        isLoggedIn: !!user,
      }}
    >
      {!checkingAuth && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
