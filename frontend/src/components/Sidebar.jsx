import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaHome, FaUsers, FaSignOutAlt, FaBicycle, FaParking, FaCalendarAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "@styles/Sidebar.css";
import LogoUBBblanco from "@assets/LogoUBBblanco.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const userStr = sessionStorage.getItem("usuario");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role;

  const logoutSubmit = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <img src={LogoUBBblanco} className="sidebar-logo" />
      <h2>Sistema Bicicletero</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon"/> Inicio
            </NavLink>
          </li>
          {userRole === "administrador" && (
            <li>
              <NavLink to="/users">
                <FaUsers className="icon"/> Usuarios
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile">
              <CgProfile className="icon"/> Perfil
            </NavLink>
          </li>

          {userRole === "administrador" && (
            <li>
              <NavLink to="/bicicletas">
                <FaBicycle className="icon"/> Bicicletas
              </NavLink>
            </li>
          )}

          {userRole === "guardia" && (
            <li>
              <NavLink to="/bicicletas">
                <FaBicycle className="icon"/> Bicicletas
              </NavLink>
            </li>
          )}

          {userRole === "guardia" && (
            <li>
              <NavLink to="/buscar-bicicletas">
                <FaBicycle className="icon"/> Buscar Bicicletas
              </NavLink>
            </li>
          )}

          {userRole === "administrador" && (
            <li>
              <NavLink to="/parking">
                <FaParking className="icon"/> Bicicletero
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/reservas">
              <FaCalendarAlt className="icon"/> Reservas
            </NavLink>
          </li>

          {(userRole === "administrador" || userRole === "guardia") && (
            <li>
              <NavLink to="/registro-entrada-salida">
                <FaBicycle className="icon"/> Entrada/Salida
              </NavLink>
            </li>
          )}

          <li style={{ height: "70%" }}/>
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit}>
              <FaSignOutAlt className="icon"/> Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
