import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import GenerateLesson from "./pages/GenerateLesson";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/generate-lesson"
            element={
              <PrivateRoute>
                <GenerateLesson />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/generate-lesson" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
