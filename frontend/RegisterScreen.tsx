import React, { useState } from "react";
import { ScrollView, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    Name: "", Email: "", Phone: "", Address: "", DOB: "", BloodGroup: "", BMI: "", Age: "", Gender: ""
  });

  const handleChange = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Register</Text>
      {Object.keys(form).map((field) => (
        <TextInput key={field} placeholder={field} value={form[field as keyof typeof form]} onChangeText={(val) => handleChange(field, val)} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      ))}
      <Button title="Submit" onPress={() => router.push("/(tabs)/DashboardScreen")} />
    </ScrollView>
  );
}
