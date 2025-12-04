import "@styles/profile.css";
import profilePic from "@assets/profilePic.jpg";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <h1 className="profile-header">Perfil de {user.nombreCompleto}</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profilePic} alt={`${user.nombreCompleto}'s profile`} />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.nombreCompleto}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.rol}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
