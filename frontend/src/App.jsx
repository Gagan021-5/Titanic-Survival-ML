import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import shipVideo from "./assets/ship.mp4";

function App() {
  const [form, setForm] = useState({
    Pclass: "Third",
    Sex: "male",
    Age: "",
    SibSp: "",
    Parch: "",
    Fare: "",
    Embarked: "S", // new field
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const encodeInput = () => {
    const pclassMap = { First: 1, Second: 2, Third: 3 };
    const sexMap = { female: 0, male: 1 };
    const embarkedMap = { S: 0, C: 1, Q: 2 };

    return [
      pclassMap[form.Pclass],
      sexMap[form.Sex],
      Number(form.Age),
      Number(form.SibSp),
      Number(form.Parch),
      Number(form.Fare),
      embarkedMap[form.Embarked],
    ];
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      console.log("📝 Raw Form Data:", form);
      const features = encodeInput();
      if (features.some(isNaN)) throw new Error("Please fill all fields with valid values.");

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

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
        <source src={shipVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

      <motion.div
  className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 w-[350px] text-white shadow-xl"
  initial={{ opacity: 0, scale: 0.9, y: 30 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <h1 className="text-2xl font-bold text-center mb-3 ">🚢 Titanic Survival Predictor</h1>
  <p className="text-gray-300 text-center mb-4 text-sm">
    Enter passenger details
  </p>

  <div className="mb-3">
    <label className="text-sm text-gray-200">Class</label>
    <select
      name="Pclass"
      value={form.Pclass}
      onChange={handleChange}
      className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
    >
      <option>First</option>
      <option>Second</option>
      <option>Third</option>
    </select>
  </div>

  <div className="mb-3">
    <label className="text-sm text-gray-200">Sex</label>
    <select
      name="Sex"
      value={form.Sex}
      onChange={handleChange}
      className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
    >
      <option>male</option>
      <option>female</option>
    </select>
  </div>

  <div className="mb-3">
    <label className="text-sm text-gray-200">Embarked</label>
    <select
      name="Embarked"
      value={form.Embarked}
      onChange={handleChange}
      className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
    >
      <option>S</option>
      <option>C</option>
      <option>Q</option>
    </select>
  </div>

  {["Age", "SibSp", "Parch", "Fare"].map((field) => (
    <div key={field} className="mb-3">
      <label className="text-sm text-gray-200">{field}</label>
      <input
        type="number"
        name={field}
        value={form[field]}
        onChange={handleChange}
        placeholder={`Enter ${field}`}
        className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
      />
    </div>
  ))}

  <motion.button
    onClick={handlePredict}
    disabled={loading}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`w-full py-2 rounded-md font-semibold transition-all  cursor-pointer ${
      loading ? "bg-blue-700 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-900"
    }`}
  >
    {loading ? "Predicting..." : "Predict"}
  </motion.button>

  {error && <div className="mt-3 bg-red-600 text-center p-2 rounded-md text-sm">{error}</div>}
  {result && (
    <motion.div
      className={`mt-3 text-center text-white p-2 rounded-md font-semibold text-sm ${
        result === "Survived" ? "bg-green-500" : "bg-slate-800"
      } text-gray-900`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {result}
    </motion.div>
  )}
</motion.div>

    </div>
  );
}

export default App;
