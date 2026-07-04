import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main
      role="alert"
      className="max-w-md mx-auto text-center my-24 px-4 flex-grow flex flex-col justify-center items-center"
    >
      <h1 className="text-6xl font-black text-slate-900 mb-2">
        404
      </h1>

      <h2 className="text-lg font-bold text-slate-700 mb-4">
        Page Not Found
      </h2>

      <p className="text-slate-500 text-sm mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs shadow-md hover:bg-emerald-400 transition-colors"
      >
        Return Home
      </Link>
    </main>
  );
}