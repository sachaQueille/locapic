import React, { useState, useEffect, useCallback } from "react";
import { Button, Overlay, Input } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MapScreen() {
  const [position, setPosition] = useState("");
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [addPOI, setAddPOI] = useState(false);
  const [listPOI, setListPOI] = useState([]);
  const [visible, setVisible] = useState(false);
  const [titlePOI, setTitlePOI] = useState("");
  const [descPOI, setDescPOI] = useState("");
  const [latitudePOI, setLatitudePOI] = useState(0);
  const [longitudePOI, setLongitudePOI] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let position = await Location.getCurrentPositionAsync({});
      setPosition(position);
      setCurrentLatitude(position.coords.latitude);
      setCurrentLongitude(position.coords.longitude);
    })();
    AsyncStorage.getItem("Poi", (error, value) => {
      if (value) {
        const POI = JSON.parse(value);
        setListPOI(POI);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("Poi", JSON.stringify(listPOI));
  }, [listPOI]);

  let selectPOI = (e) => {
    if (addPOI) {
      setAddPOI(false);
      setVisible(true);
      setLatitudePOI(e.nativeEvent.coordinate.latitude);
      setLongitudePOI(e.nativeEvent.coordinate.longitude);
    }
  };

  const resetForm = () => {
    setVisible(false);
    setTitlePOI("");
    setDescPOI("");
  };

  return (
    <>
      <MapView
        onPress={selectPOI}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          key={"currentPos"}
          coordinate={{
            latitude: currentLatitude,
            longitude: currentLongitude,
          }}
          title="Hello"
          description="I am here"
          draggable
          opacity={0.5}
        />
        {listPOI.map((poi, i) => {
          return (
            <Marker
              key={`poi${i}`}
              coordinate={{
                latitude: poi.latitude,
                longitude: poi.longitude,
              }}
              title={poi.title}
              description={poi.desc}
              draggable
              opacity={0.5}
              pinColor="blue"
            />
          );
        })}
      </MapView>

      <Button
        onPress={() => setAddPOI(true)}
        icon={<Ionicons name="location-outline" size={24} color="white" />}
        title="Add POI"
        buttonStyle={{ backgroundColor: "#eb4d4b" }}
        type="solid"
        disabled={addPOI}
      />
      <Overlay
        isVisible={visible}
        onBackdropPress={resetForm}
        overlayStyle={{ width: 200 }}
      >
        <Input
          placeholder="Title"
          onChangeText={(e) => setTitlePOI(e)}
          defaultValue={""}
        />
        <Input
          placeholder="Description"
          onChangeText={(e) => setDescPOI(e)}
          defaultValue={""}
        />
        <Button
          onPress={() => {
            const newListPOI = [
              ...listPOI,
              {
                latitude: latitudePOI,
                longitude: longitudePOI,
                title: titlePOI,
                desc: descPOI,
              },
            ];
            setListPOI(newListPOI);
            resetForm();

            console.log(newListPOI);
          }}
          icon={<Ionicons name="location-outline" size={24} color="white" />}
          title="Add POI"
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          type="solid"
        />
      </Overlay>
    </>
  );
}
