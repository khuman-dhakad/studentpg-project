function PGCard({ name, location, rent, type }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 hover:shadow-xl transition">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
          alt="PG Room"
          className="w-full h-52 object-cover"
        />

        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          Verified
        </span>

        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          {type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold">{name}</h3>

        <p className="text-gray-600 mt-1">
          📍 {location}, Bhopal
        </p>

        <p className="text-2xl font-bold text-blue-600 mt-3">
          ₹{rent}
          <span className="text-sm text-gray-500 font-normal">
            {" "} / month
          </span>
        </p>

        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-green-500 text-white py-2 rounded-lg">
            WhatsApp
          </button>

          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default PGCard;