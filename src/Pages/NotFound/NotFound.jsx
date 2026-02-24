import React from "react";

export default function NotFound() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-6">
        <div className="text-center">
          <h1 className="text-[10rem] font-extrabold mb-6">404</h1>
          <h2 className="text-3xl md:text-5xl font-semibold mb-4">
            Page Not Found
          </h2>
          <p className="text-md md:text-lg text-gray-600 mb-8">
            Sorry, the page you are looking for does not exist.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition-all duration-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </>
  );
}
