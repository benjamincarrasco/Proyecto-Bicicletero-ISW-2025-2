import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import LuckyCatIECI from "@assets/LuckyCatIECI.png";
import "@styles/loginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  // Función que maneja el envío del formulario de inicio de sesión
  const loginSubmit = async (data) => {
    try {
      const response = await loginService(data);
      if (response && response.status === 200) {
        // El login fue exitoso, el token ya está guardado en sessionStorage por auth.service
        console.log("✓ Acceso concedido");
        navigate("/home");
      } else if (response && response.status === 401) {
        console.log("✗ Credenciales inválidas");
        setLoginError("Usuario o contraseña incorrectos");
      } else {
        console.log("✗ Error durante el login");
        setLoginError("Error en el login. Por favor intenta de nuevo.");
      }
    } catch {
      console.error("✗ Error en la conexión");
      setLoginError("Error en la conexión con el servidor");
    }
  };

  return (
    <main className="page-root">
      <div className="lucky-cat-container">
        <img src={LuckyCatIECI} alt="Lucky Cat" className="lucky-cat" />
      </div>
      <div className="login-register-container">
        <LoginRegisterForm mode="login" onSubmit={loginSubmit} loginError={loginError} />
      </div>
    </main>
  );
};

export default Login;
