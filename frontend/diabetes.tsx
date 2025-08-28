import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView } from "react-native";
import { predictDiabetes } from "../../src/services/predict";

export default function DiabetesScreen() {
  const [form, setForm] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setResultMessage(""); // clear old message

      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v)])
      );

      const result = await predictDiabetes(payload);
      console.log("API Result:", result);

      // Format the output
      const message = `Prediction: ${result.recommendation}\nProbability: ${result.probability}\nRisk: ${result.risk_score}`;
      setResultMessage(message);
    } catch (err) {
      console.error(err);
      setResultMessage("Error: Something went wrong while predicting diabetes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="height"
        >
    <ScrollView
    style={{ flex: 1, backgroundColor: "#fff" }}
    contentContainerStyle={{ padding: 16, paddingBottom: 40 }} // 👈 important
    keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Diabetes Prediction
      </Text>

      {Object.keys(form).map((field) => (
        <View key={field} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 4 }}>{field}</Text>
          <TextInput
            value={form[field as keyof typeof form]}
            onChangeText={(text) => handleChange(field, text)}
            placeholder={`Enter ${field}`}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 8,
            }}
          />
        </View>
      ))}

      <Button
        title={loading ? "Predicting..." : "Predict Diabetes"}
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
