import Navbar from "./components/Navbar";
function App() {
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
     <Navbar />
    <h1 className="text-5xl font-bold text-blue-600 mb-4">
      StudentPG Bhopal
    </h1>
    <p className="text-xl text-gray-700">
      Find your perfect PG in Bhopal
    </p>
  </div>
);
}

export default App;