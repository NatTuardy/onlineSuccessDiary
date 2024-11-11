import { Routes, Route } from "react-router-dom";
import "./App.css";
import DaysPage from "./components/daysPage";
import FormPage from "./components/formPage";

function App() {

  return (
    <div className="container mt-5">
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/days" element={<DaysPage />} />
      </Routes>
    </div>
  );
}

export default App;
