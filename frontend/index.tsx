import React from "react";
import { ScrollView, Text, StyleSheet, View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CuraPath</Text>

      <Text style={styles.description}>
        Your Health, Your Insight.
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Login" onPress={() => router.push("/LoginScreen")} />
        <View style={{ height: 10 }} />
        <Button title="Register" onPress={() => router.push("/RegisterScreen")} />
        <View style={{ height: 10 }} />
        <Button title="Dashboard" onPress={() => router.push("/DashboardScreen")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#1E3A8A",
  },
  description: {
    fontSize: 20,
    textAlign: "center",
    color: "#444",
    lineHeight: 22,
  },
});
