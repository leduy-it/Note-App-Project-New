import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  StatusBar,
  ImageBackground,
} from "react-native";
import RoundIconBtn from "../components/RoundIconBtn";
import colors from "../misc/colors";

const backgroundImage = require("../image/background/img_note1.png");


const Intro = ({ onFinish }) => {
  const [name, setName] = useState("");

  const handleOnChangeText = (text) => setName(text);

  const handleSubmit = async () => {
    const user = { name };
    await AsyncStorage.setItem("user", JSON.stringify(user));

    if (onFinish) onFinish();
  };

  return (
    <>
      <ImageBackground
        source={backgroundImage}
        resizeMode={"cover"}
        style={styles.background}
      >
        <StatusBar hidden />
        <View style={styles.container}>
          <Text style={styles.title}>Chào mừng bạn đến với ứng dụng của chúng tôi!</Text>

          <TextInput
            value={name}
            onChangeText={handleOnChangeText}
            placeholder="Nhập tên của bạn"
            style={styles.textInput}
          />

          {name.trim().length > 3 && (
            <RoundIconBtn
              antIconName="arrowright"
              onPress={handleSubmit}
              style={styles.button}
            />
          )}
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.LIGHT,
    alignSelf: "center",
    marginHorizontal: 40,
    marginBottom: 30,
    textAlign: "center",
  },
  textInput: {
    width: Dimensions.get("window").width - 50,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 25,
    marginBottom: 30,
    backgroundColor: colors.LIGHT,
    opacity: 0.8,
  },
  button: {
    marginTop: 30,
  },
});

export default Intro;
