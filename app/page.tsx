// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import foodbanner from "../app/images/foodbanner.png"; // ✅ default import

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 p-6">
      <div className="text-center">
        {/* Main Title and Subtitle */}
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome to Food Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Track your meals!!!
        </p>

        {/* Card Section */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-sm mx-auto">
          {/* Image */}
          <div className="relative w-48 h-48 mb-6">
            <Image
              src={foodbanner}
              alt="Food Tracker Logo"
              fill // ✅ ใช้แทน layout="fill"
              className="rounded-full object-contain"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 w-full">
            <Link href="/login">
              <button className="w-full px-6 py-3 text-lg font-semibold text-green-600 bg-white border-2 border-white hover:bg-green-600 hover:text-white rounded-full transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="w-full px-6 py-3 text-lg font-semibold text-green-600 bg-white border-2 border-white hover:bg-blue-500 hover:text-white rounded-full transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Register
              </button>
            </Link>
          </div>
        </div>
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Created by Winchanut! All rights
          reserved.
        </footer>
      </div>
    </main>
  );
}
