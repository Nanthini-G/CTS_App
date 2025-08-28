import React from "react";
import { View, StyleSheet } from "react-native";
import ChatBot from "../../components/ChatBot";


export default function ChatTab() {
  return (
    <View style={styles.container}>
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
