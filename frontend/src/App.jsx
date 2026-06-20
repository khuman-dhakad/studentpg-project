import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import heroImage from "./assets/hero.webp";

import Navbar from "./components/Navbar";
import PGCard from "./components/PGCard";
import StatsSection from "./components/StatsSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

import OwnerAuth from "./pages/OwnerAuth";

function App() {
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedType, setSelectedType] = useState("Both");

  const allPGs = [
    {
      id: 1,
      name: "Krishna PG",
      location: "Kolar Road",
      rent: "4500",
      type: "Boys",
    },
    {
      id: 2,
      name: "LNCT Boys PG",
      location: "Kalua Kheda",
      rent: "5500",
      type: "Boys",
    },
    {
      id: 3,
      name: "MP Nagar Girls PG",
      location: "MP Nagar",
      rent: "6500",
      type: "Girls",
    },
  ];

  const filteredPGs = allPGs.filter((pg) => {
    const areaMatch =
      selectedArea === "All" || pg.location === selectedArea;

    const typeMatch =
      selectedType === "Both" || pg.type === selectedType;

    return areaMatch && typeMatch;
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-100">
            <Navbar />

            {/* Hero Section */}
            <div
              className="relative h-[85vh] bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage: `url(${heroImage})`,
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>

              <div className="relative z-10 text-center px-4 max-w-5xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Find Your Perfect PG in Bhopal
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  Near LNCT • RGPV • MANIT • MP Nagar
                </p>

                <div className="bg-white p-5 rounded-2xl shadow-2xl flex flex-wrap justify-center gap-4">
                  <select
                    className="border p-3 rounded-xl"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    <option>All</option>
                    <option>Kolar Road</option>
                    <option>MP Nagar</option>
                    <option>Indrapuri</option>
                    <option>Ayodhya Bypass</option>
                  </select>

                  <select
                    className="border p-3 rounded-xl"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option>Both</option>
                    <option>Boys</option>
                    <option>Girls</option>
                  </select>

                  <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700">
                    Search PGs
                  </button>
                </div>

                <p className="text-white mt-6 text-lg">
                  ⭐ Trusted by 500+ Students Across Bhopal
                </p>
              </div>
            </div>

            {/* Featured PGs */}
            <div className="max-w-7xl mx-auto px-4 py-20">
              <h2 className="text-4xl font-bold text-center mb-12">
                Featured PGs
              </h2>

              <div className="flex flex-wrap justify-center gap-8">
                {filteredPGs.map((pg) => (
                  <PGCard
                    key={pg.id}
                    name={pg.name}
                    location={pg.location}
                    rent={pg.rent}
                    type={pg.type}
                  />
                ))}
              </div>
            </div>

            <StatsSection />
            <HowItWorks />
            <Footer />
          </div>
        }
      />

      <Route path="/owner-auth" element={<OwnerAuth />} />
    </Routes>
  );
}

export default App;