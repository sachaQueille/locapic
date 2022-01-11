import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function HomeScreen({ navigation, onSubmitPseudo }) {
  const [pseudo, setPseudo] = useState("");
  const [userExist, setUserExist] = useState(false);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("user", function (error, data) {
        if (data) {
          const userData = JSON.parse(data);
          console.log(userData);
          setPseudo(userData);

          setUserExist(true);
        }
      });
    }, [])
  );

  return (
    <ImageBackground
      source={require("../assets/img/home.jpg")}
      style={styles.container}
    >
      {!userExist ? (
        <Input
          placeholder="Enter name"
          leftIcon={{ type: "font-awesome", name: "user", color: "#eb4d4b" }}
          onChangeText={(e) => setPseudo(e)}
          defaultValue={pseudo}
        />
      ) : (
        <Text>Welcome back</Text>
      )}

      <Button
        icon={{
          type: "ant-design",
          name: "arrowright",
          size: 20,
          color: "#eb4d4b",
        }}
        title="Go to Map"
        onPress={() => {
          onSubmitPseudo(pseudo);
          AsyncStorage.setItem("user", JSON.stringify(pseudo));
          navigation.navigate("BottomNavigator", { screen: "Map" });
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo: pseudo });
    },
  };
}
export default connect(null, mapDispatchToProps)(HomeScreen);
