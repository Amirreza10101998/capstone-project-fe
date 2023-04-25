import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";



function LandingPage() {
    return (
        <div className="App">
            <Navbar />
            <HeroSection imgSrc="https://images.unsplash.com/photo-1534205643743-6737932c79ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" />
            <Footer />

        </div>
    );
}

export default LandingPage