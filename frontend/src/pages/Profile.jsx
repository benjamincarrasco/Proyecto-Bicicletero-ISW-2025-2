import { useEffect, useState } from "react";
import { useGetProfile } from "@hooks/profile/useGetProfile.jsx";
import ProfileCard from "@components/ProfileCard.jsx";
import "@styles/profile.css";

const Profile = () => {
  const { fetchProfile } = useGetProfile();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetchProfile();
        setProfileData(response?.data);
        setError(null);
        console.log("✓ Perfil cargado");
      } catch (err) {
        console.error("✗ Error al cargar perfil");
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    getProfileData();
  }, []);

  if (loading) return <div className="profile-container">Cargando perfil...</div>;
  if (error) return <div className="profile-container error">{error}</div>;

  return (
    <div>
      {profileData ? (
        <div className="profile-container">
          <ProfileCard user={profileData} />
        </div>
      ) : (
        <p>No se encontraron datos del perfil</p>
      )}
    </div>
  );
};

export default Profile;
