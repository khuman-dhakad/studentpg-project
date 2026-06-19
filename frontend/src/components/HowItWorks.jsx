function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h2 className="text-4xl font-bold text-center mb-12">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">
            Search PG
          </h3>
          <p className="text-gray-600">
            Find verified PGs in your preferred area and budget.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-5xl mb-4">📞</div>
          <h3 className="text-2xl font-bold mb-2">
            Contact Owner
          </h3>
          <p className="text-gray-600">
            Directly call or WhatsApp the PG owner.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-2xl font-bold mb-2">
            Move In
          </h3>
          <p className="text-gray-600">
            Visit the PG, verify details and move in.
          </p>
        </div>

      </div>
    </div>
  );
}

export default HowItWorks;