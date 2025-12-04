import { useForm } from "react-hook-form";
import "@styles/LoginRegisterForm.css";

const LoginRegisterForm = ({ mode = "login", onSubmit, loginError}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onFormSubmit = (data) => {
    const payload =
      mode === "login" ? { email: data.email, password: data.password } : data;
    onSubmit(payload);
  };

  return (
    <div className="login-register-form">
      <h2 className="form-title">
        {mode === "login" ? "Iniciar sesión" : "Registrarse"}
      </h2>
      
      {mode === "login" && (Object.values(errors).length > 0 || loginError) && (
        <div className="form-error-container">
          <p>{errors.email?.message || errors.password?.message || loginError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {mode === "register" && (
          <div className="form-group">
            <label>Nombre de usuario:</label>
            <input
              type="text"
              min={3}
              {...register("username", {
                required: "El nombre de usuario es obligatorio",
                minLength: {
                  value: 3,
                  message:
                    "El nombre de usuario debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message:
                    "El nombre de usuario debe tener como máximo 30 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "El usuario sólo puede contener letras, números y guiones bajos",
                },
              })}
            />
            {errors.username && (
              <span className="form-error-container">
                {errors.username.message}
              </span>
            )}
          </div>
        )}
        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message:
                  "El correo debe ser un correo válido",
              },
            })}
          />
          {errors.email && (
            <span className="form-error-container">{errors.email.message}</span>
          )}
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label>Rut:</label>
            <input
              type="text"
              {...register("rut", {
                required: "El rut es obligatorio",
                pattern: {
                  value: /^\d{2}\.\d{3}\.\d{3}-[\dkK]$/,
                  message: "Formato rut inválido. Debe ser xx.xxx.xxx-x.",
                },
              })}
            />
            {errors.rut && (
              <span className="form-error-container">{errors.rut.message}</span>
            )}
          </div>
        )}

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
              maxLength: {
                value: 26,
                message: "La contraseña debe tener como máximo 26 caracteres",
              },
            })}
          />
          {errors.password && (
            <span className="form-error-container">
              {errors.password.message}
            </span>
          )}
        </div>

        <button type="submit">
          {mode === "login" ? "Entrar" : "Registrarse"}
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        {mode === "login" ? (
          <p>
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginRegisterForm;
