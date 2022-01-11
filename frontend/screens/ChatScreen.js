import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { ListItem, Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import socketIOClient from "socket.io-client";
import { useSelector } from "react-redux";

const socket = socketIOClient("http://192.168.0.30:3000");

export default function ChatScreen() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);

  const pseudoUser = useSelector((state) => state.pseudo);

  const replaceStringWithEmoji = (string) => {
    const emojiMap = {
      ":)": "😊",
      ":(": "🙁",
      ":D": "😁",
      ";(": "😥",
      ":O": "😮",
      ";)": "😉",
      "8)": "😎",
      ">:@": "😡",
    };
    let regex = /(?::\)|:\(|:D|;\(|:O'|;\)|8\)|>:@)/g;
    return string.replace(regex, (m) => emojiMap[m] || m);
  };

  useEffect(() => {
    socket.on("sendMessageToAll", (newMessage) => {
      // const myRegex = /:\)/g;
      console.log(newMessage);
      // newMessage.currentMessage = newMessage.currentMessage.replace(
      //   myRegex,
      //   "😀 "
      // );
      newMessage.currentMessage = replaceStringWithEmoji(
        newMessage.currentMessage
      );
      setListMessage((listMessageState) => [...listMessageState, newMessage]);
    });
    return () => {
      socket.off("sendMessageToAll");
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>
        {listMessage.map((message, i) => {
          return (
            <ListItem key={`message${i}`}>
              <ListItem.Title>{message.pseudoUser}</ListItem.Title>
              <ListItem.Subtitle>{message.currentMessage}</ListItem.Subtitle>
            </ListItem>
          );
        })}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Input
          containerStyle={{ marginBottom: 5 }}
          placeholder="Your message"
          onChangeText={(e) => setCurrentMessage(e)}
          value={currentMessage}
        />
        <Button
          icon={<Icon name="envelope-o" size={20} color="#ffffff" />}
          title="Send"
          buttonStyle={{ backgroundColor: "#eb4d4b" }}
          type="solid"
          onPress={() => {
            socket.emit("sendMessage", { currentMessage, pseudoUser });
            setCurrentMessage("");
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
