import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";



function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection imgSrc="https://images.unsplash.com/photo-1534205643743-6737932c79ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" />
      <Footer />

    </div>
  );
}

export default App;
