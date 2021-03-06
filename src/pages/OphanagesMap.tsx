import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

import mapMarker from "../assets/map-marker.png";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

// pegar a localização demora muito
export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [location, setLocation] = useState<Region>({
    latitude: -15.8466048,
    longitude: -47.9035392,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
      }

      try {
        let userLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLocation.coords;

        setLocation({ ...location, latitude, longitude });
        console.log(userLocation.coords);
      } catch (error) {
        alert("Cant get current location");
      }
    })();
  }, []);

  function navigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanagesDetails", { id });
  }

  function navigateToCreateOrphanage() {
    navigation.navigate("SelectMapPosition");
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
        // initialRegion={{
        //   latitude: location.latitude,
        //   longitude: location.longitude,
        //   latitudeDelta: 0.008,
        //   longitudeDelta: 0.008,
        // }}
        region={location}
      >
        <Marker
          icon={mapMarker}
          calloutAnchor={{
            x: 2.7,
            y: 0.8,
          }}
          coordinate={{ latitude: -15.8466048, longitude: -47.9035392 }}
        >
          <Callout tooltip onPress={() => navigateToOrphanageDetails(1)}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutText}>Lar das meninas</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}> 2 orfanatos encontrados</Text>
        <RectButton
          style={styles.createOrphanageButton}
          onPress={navigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    justifyContent: "center",
  },

  calloutText: {
    color: "#0089a5",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },

  footerContainer: {
    position: "absolute",
    right: 24,
    left: 24,
    bottom: 32,

    backgroundColor: "#fff",
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

  footerText: {
    color: "#8fa7b3",
    fontFamily: "Nunito_700Bold",
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: "#15c3d6",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
});
