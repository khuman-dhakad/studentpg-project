function ListYourPG() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 my-10">

      <h2 className="text-3xl font-bold text-center mb-8">
        List Your PG
      </h2>

      <form className="space-y-4">

        <input
          type="text"
          placeholder="Owner Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="PG Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Monthly Rent"
          className="w-full border p-3 rounded-lg"
        />

        <select className="w-full border p-3 rounded-lg">
          <option>Boys</option>
          <option>Girls</option>
          <option>Both</option>
        </select>

        <input
          type="text"
          placeholder="Food Available (Yes/No)"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="WiFi Available (Yes/No)"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Image URL"
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Submit PG
        </button>

      </form>
    </div>
  );
}

export default ListYourPG;