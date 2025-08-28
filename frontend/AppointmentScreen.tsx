import React, { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";

// Define appointment type
type Appointment = {
  type: string;
  datetime: string;
  medication: string;
};

export default function AppointmentScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addAppointment = () => {
    setAppointments((prev) => [
      ...prev,
      { type: "Checkup", datetime: "Tomorrow", medication: "Vitamin D" },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <Button title="Add Appointment" onPress={addAppointment} />

      {appointments.map((a, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.text}>
            {a.type} | {a.datetime} | {a.medication}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  text: { fontSize: 16 },
});
