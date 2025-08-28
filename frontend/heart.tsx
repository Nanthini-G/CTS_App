import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView } from "react-native";
import { predictHeart } from "../../src/services/predict";

// Import vitals JSON file
import heartVitals from "../../assets/data/heart_vitals.json";

export default function HeartScreen() {
  const [index, setIndex] = useState(0); // track which patient record
  const [form, setForm] = useState(heartVitals[0]); // start with first patient
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handlePredict = async () => {
    try {
      setLoading(true);
      setResultMessage("");

      const payload = form; // current patient record

      const result = await predictHeart(payload);
      console.log("API Result:", result);

      // Format the output
      const message = `Prediction: ${result.recommendation}\nProbability: ${result.probability}\nRisk: ${result.risk_score}`;
      setResultMessage(message);

      // Move to next patient
      const nextIndex = (index + 1) % heartVitals.length;
      setIndex(nextIndex);
      setForm(heartVitals[nextIndex]); // load next record
    } catch (err) {
      console.error(err);
      setResultMessage("Error: Something went wrong while predicting heart disease.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    >
    <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }} // 👈 important
        keyboardShouldPersistTaps="handled"
        >

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Heart Disease Prediction
      </Text>

      {/* Display patient vitals as read-only fields */}
      {Object.keys(form).map((field) => (
        <View key={field} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 4 }}>{field}</Text>
          <TextInput
            value={String(form[field as keyof typeof form])}
            editable={false} // disable editing
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 8,
              backgroundColor: "#f9f9f9",
              color: "#333",
            }}
          />
        </View>
      ))}

      <Button
        title={loading ? "Predicting..." : "Predict Heart Disease"}
        onPress={handlePredict}
        disabled={loading}
      />

      {resultMessage ? (
        <View
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#f2f2f2",
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: resultMessage.startsWith("Error") ? "red" : "green",
            }}
          >
            {resultMessage}
          </Text>
        </View>
      ) : null}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
