
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import StatsSection from "./components/StatsSection";
import Navbar from "./components/Navbar";
import PGCard from "./components/PGCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-5xl font-bold text-blue-600 mb-4 text-center">
          Find Verified PGs & Rooms in Bhopal
        </h1>

        <p className="text-xl text-gray-700 text-center max-w-2xl">
          Browse trusted PGs, rooms and hostels near colleges and prime
          locations in Bhopal.
        </p>

        {/* Search Section */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-lg flex gap-4">
          <select className="border p-2 rounded-lg">
            <option>Kolar Road</option>
            <option>MP Nagar</option>
            <option>Indrapuri</option>
            <option>Ayodhya Bypass</option>
          </select>

          <select className="border p-2 rounded-lg">
            <option>Both</option>
            <option>Boys</option>
            <option>Girls</option>
          </select>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Search PGs
          </button>
        </div>
      </div>

      {/* Featured PGs */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured PGs
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <PGCard />
          <PGCard />
          <PGCard />
        </div>
      </div>
      <StatsSection />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default App;