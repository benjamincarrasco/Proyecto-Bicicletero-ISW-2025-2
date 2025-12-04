import "@styles/home.css";
import LogoIECI from "@assets/LogoIECI.png";

const Home = () => {
  return (
    <div className="home-banner">
      <h1>Ingeniería de ejecución en computación e informática</h1>
      <img src={LogoIECI} className="icon" />
    </div>
  );
};

export default Home;
