"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data for a logged-in user
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  profileImageUrl: "https://placehold.co/100x100/A3E635/ffffff?text=User",
};

export default function ProfilePage() {
  const [firstName, setFirstName] = useState(mockUser.firstName);
  const [lastName, setLastName] = useState(mockUser.lastName);
  const [email, setEmail] = useState(mockUser.email);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    mockUser.profileImageUrl
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this is where you would send data to your backend
    alert(
      `บันทึกข้อมูลสำเร็จ:\nชื่อ: ${firstName}\nนามสกุล: ${lastName}\nอีเมล: ${email}`
    );
    // You would also handle image file upload here
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-12">
      <div className="container mx-auto">
        {/* Back to Dashboard Link */}
        <Link
          href="/dashboard"
          passHref
          className="absolute top-6 left-6 flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="font-medium hidden md:inline">กลับไปแดชบอร์ด</span>
        </Link>

        <h1 className="text-4xl font-extrabold text-center mb-10">
          แก้ไขโปรไฟล์
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10"
          >
            {/* Profile Image and Upload */}
            <div className="mb-8 flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                รูปโปรไฟล์
              </label>
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden shadow-lg border-2 border-slate-300">
                <Image
                  src={
                    imagePreview ||
                    "https://placehold.co/100x100/A3E635/ffffff?text=User"
                  }
                  alt="Profile Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <label
                htmlFor="image-upload"
                className="inline-block text-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-300 transform hover:scale-105 cursor-pointer"
              >
                เปลี่ยนรูปภาพ
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* First Name Input */}
            <div className="mb-6">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                ชื่อ
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Last Name Input */}
            <div className="mb-6">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                นามสกุล
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-8">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
