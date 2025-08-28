import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>User Profile</Text>
      <Button
        title="Go to Dashboard"
        onPress={() => router.push("/")} // "/" = index.tsx (your dashboard/home)
      />
    </View>
  );
}
