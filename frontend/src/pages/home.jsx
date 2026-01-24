import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SessionType from "../components/SessionType";
import TopCouncellors from "../components/TopCouncellors";

const Home = () => {
  return (
    <div>
      <Header />
      <SessionType />
      <TopCouncellors />
      <Banner />
      <Footer />
    </div>
  );
};

export default Home;
