import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import StatsSection from "./components/StatsSection";
import Navbar from "./components/Navbar";
import PGCard from "./components/PGCard";

function App() {
  const filteredPGs = [
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
  );
}

export default App;