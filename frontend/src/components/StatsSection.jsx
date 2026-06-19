function StatsSection() {
  return (
    <div className="bg-blue-600 text-white py-16 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

        <div>
          <h2 className="text-4xl font-bold">500+</h2>
          <p className="mt-2">Students Helped</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">100+</h2>
          <p className="mt-2">Verified PGs</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">15+</h2>
          <p className="mt-2">Areas Covered</p>
        </div>

      </div>
    </div>
  );
}

export default StatsSection;