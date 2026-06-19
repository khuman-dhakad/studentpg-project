function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 text-center">

        <h2 className="text-2xl font-bold">
          StudentPG Bhopal
        </h2>

        <p className="mt-3 text-gray-400">
          Find verified PGs, hostels and rooms near colleges in Bhopal.
        </p>

        <div className="mt-6 flex justify-center gap-6">
          <a href="#" className="hover:text-blue-400">
            About
          </a>

          <a href="#" className="hover:text-blue-400">
            Contact
          </a>

          <a href="#" className="hover:text-blue-400">
            Privacy Policy
          </a>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          © 2026 StudentPG Bhopal. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;