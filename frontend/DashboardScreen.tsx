import React from "react";
import { View, Button, Text } from "react-native";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Health Dashboard</Text>
      
      <Button title="Diabetes Analysis" onPress={() => router.push("/diabetes")} />
      <Button title="Heart Health" onPress={() => router.push("/heart")} />
      <Button title="Appointments" onPress={() => router.push("/AppointmentScreen")} />
    </View>
  );
}
