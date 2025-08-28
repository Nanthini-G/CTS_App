// src/services/predict.ts

const API_BASE = "http://127.0.0.1:5000"; // <-- Use your PC LAN IP, not 127.0.0.1 for mobile

// -------------------- DIABETES --------------------
export async function predictDiabetes(payload: any) {
  const response = await fetch(`${API_BASE}/predict/diabetes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json(); // expects { prediction, probability, risk }
}

// -------------------- HEART --------------------
export async function predictHeart(payload: any) {
  const response = await fetch(`${API_BASE}/predict/heart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json(); // expects { prediction, probability, risk }
}

// -------------------- COMBINED PREDICT + CARE --------------------
export async function predictAndRecommend(payload: any) {
  /**
   * Expects payload structure:
   * {
   *   heart: { ...heart features... },
   *   diabetes: { ...diabetes features... }
   * }
   *
   * Returns:
   * {
   *   heart: { prediction, probability, risk },
   *   diabetes: { prediction, probability, risk },
   *   care: { overall_level, codes, suggestions }
   * }
   */
  const response = await fetch(`${API_BASE}/predict/both`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json();
}
