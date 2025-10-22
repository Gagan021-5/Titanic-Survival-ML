import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import shipVideo from "./assets/ship.mp4";

function App() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Pclass: "Third",
      Sex: "male",
      Embarked: "S",
      Age: "",
      SibSp: "",
      Parch: "",
      Fare: "",
    },
  });

  const encodeInput = (data) => {
    const pclassMap = { First: 1, Second: 2, Third: 3 };
    const sexMap = { female: 0, male: 1 };
    const embarkedMap = { S: 0, C: 1, Q: 2 };

    return [
      pclassMap[data.Pclass],
      sexMap[data.Sex],
      Number(data.Age),
      Number(data.SibSp),
      Number(data.Parch),
      Number(data.Fare),
      embarkedMap[data.Embarked],
    ];
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const features = encodeInput(data);

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

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 w-[350px] text-white shadow-xl"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-2xl font-bold text-center mb-3">🚢 Titanic Survival Predictor</h1>
        <p className="text-gray-300 text-center mb-4 text-sm">Enter passenger details</p>

        {/* Class */}
        <div className="mb-3">
          <label className="text-sm text-gray-200">Class</label>
          <select
            {...register("Pclass", { required: true })}
            className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
          >
            <option>First</option>
            <option>Second</option>
            <option>Third</option>
          </select>
        </div>

        {/* Sex */}
        <div className="mb-3">
          <label className="text-sm text-gray-200">Sex</label>
          <select
            {...register("Sex", { required: true })}
            className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
          >
            <option>male</option>
            <option>female</option>
          </select>
        </div>

        {/* Embarked */}
        <div className="mb-3">
          <label className="text-sm text-gray-200">Embarked</label>
          <select
            {...register("Embarked", { required: true })}
            className="mt-1 p-2 w-full rounded-md bg-gray-900 border border-gray-600 text-sm"
          >
            <option>S</option>
            <option>C</option>
            <option>Q</option>
          </select>
        </div>

        {/* Numeric fields */}
        {["Age", "SibSp", "Parch", "Fare"].map((field) => (
          <div key={field} className="mb-3">
            <label className="text-sm text-gray-200">{field}</label>
            <input
              type="number"
              {...register(field, { required: true, min: 0 })}
              placeholder={`Enter ${field}`}
              className={`mt-1 p-2 w-full rounded-md border text-sm ${
                errors[field] ? "border-red-500 bg-gray-800" : "border-gray-600 bg-gray-900"
              } text-white`}
            />
            {errors[field] && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid {field}</p>
            )}
          </div>
        ))}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-2 rounded-md font-semibold transition-all cursor-pointer ${
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
      </motion.form>
    </div>
  );
}

export default App;
