function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          StudentPG Bhopal
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          List Your PG
        </button>
      </div>
    </nav>
  );
}

export default Navbar;