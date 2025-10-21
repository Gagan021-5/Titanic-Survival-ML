import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import shipVideo from "./assets/ship.mp4";

function App() {
  const [form, setForm] = useState({
    Pclass: "",
    Sex: "",
    Age: "",
    SibSp: "",
    Parch: "",
    Fare: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const features = Object.values(form).map(Number);
      if (features.some(isNaN)) {
        throw new Error("Please enter valid numbers for all fields.");
      }
      const res = await axios.post(
        "http://127.0.0.1:5000/predict",
        { features },
        { headers: { "Content-Type": "application/json" } }
      );
      setResult(res.data.result);
    } catch (err) {
      setError(err.message || "Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      name: "Pclass",
      label: "Passenger Class",
      min: 1,
      max: 3,
      step: 1,
      placeholder: "Enter class (1-3)",
    },
    {
      name: "Sex",
      label: "Sex",
      min: 0,
      max: 1,
      step: 1,
      placeholder: "Enter 0 (female) or 1 (male)",
    },
    {
      name: "Age",
      label: "Age",
      min: 0,
      max: 100,
      step: 1,
      placeholder: "Enter age (0-100)",
    },
    {
      name: "SibSp",
      label: "Siblings/Spouses Aboard",
      min: 0,
      max: 8,
      step: 1,
      placeholder: "Enter number (0-8)",
    },
    {
      name: "Parch",
      label: "Parents/Children Aboard",
      min: 0,
      max: 6,
      step: 1,
      placeholder: "Enter number (0-6)",
    },
    {
      name: "Fare",
      label: "Fare",
      min: 0,
      max: 500,
      step: 0.01,
      placeholder: "Enter fare (0-500)",
    },
  ];

  return (
    <div className="titanic-bg relative min-h-screen flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={shipVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      <motion.div
        className="form-card relative z-10"
        initial={{ opacity: 0, scale: 0.85, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          🚢 Titanic Survival Predictor
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Enter passenger details to predict survival
        </p>

        <div className="space-y-4">
          {inputFields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-200">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                step={field.step}
                placeholder={field.placeholder}
                className="mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-900 text-white placeholder-gray-500"
                aria-label={field.label}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <motion.button
          onClick={handlePredict}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full mt-6 py-2 px-4 rounded-md text-white font-semibold transition-all duration-200 ${
            loading
              ? "bg-blue-700 cursor-not-allowed"
              : "bg-blue-800 cursor-pointer hover:bg-blue-900"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                />
              </svg>
              Predicting...
            </span>
          ) : (
            "Predict Survival"
          )}
        </motion.button>

        {error && (
          <motion.div
            className="mt-4 p-3 bg-red-600 text-red-100 rounded-md text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            className="mt-4 p-3 bg-yellow-600 text-gray-900 rounded-md text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-lg font-semibold">Prediction: {result}</h2>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;