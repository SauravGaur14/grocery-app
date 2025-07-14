import * as Location from "expo-location";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "John",
    email: "john@gmail.com",
    phone: "+91 7010101010",
    addresses: [],
  });
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);

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
      setUser((prev) => {
        const updated = {
          ...prev,
          addresses: [...prev.addresses, addressObj],
        };
        return updated;
      });
      return addressObj; //  return the added address
    } else {
      console.warn("Invalid address object passed to addAddress.");
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        addAddress,
        locationPermissionGranted,
        gpsEnabled,
        getLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
