"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Function for handling form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function for handling profile image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setProfileImageFile(file);
    } else {
      setImagePreview(null);
      setProfileImageFile(null);
    }
  };

  // Function to remove the selected image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setProfileImageFile(null);
    // You might also want to reset the file input field, but it's not strictly necessary for functionality.
    const fileInput = document.getElementById(
      "profile-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    console.log("Image File:", profileImageFile);
    alert("Registration successful!"); // Use a custom modal in a real application instead of alert()
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-2">
          ลงทะเบียน
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          สร้างบัญชีของคุณเพื่อเริ่มติดตามมื้ออาหาร
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Profile Image Upload Section */}
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                ไม่มีรูปภาพ
              </div>
            )}
            <label
              htmlFor="profile-image"
              className="mt-4 px-6 py-2 bg-slate-700 text-white font-semibold rounded-full shadow-md hover:bg-slate-800 transition duration-300 cursor-pointer"
            >
              เลือกรูปภาพโปรไฟล์
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                ลบรูปภาพ
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 bg-white text-gray-900 focus:border-slate-700 focus:ring focus:ring-slate-700 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 bg-white text-gray-900 focus:border-slate-700 focus:ring focus:ring-slate-700 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 bg-white text-gray-900 focus:border-slate-700 focus:ring focus:ring-slate-700 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              เพศ
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-slate-700 focus:ring focus:ring-slate-700 focus:ring-opacity-50 bg-white text-gray-900"
            >
              <option value="">เลือกเพศ...</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-slate-700 text-white font-semibold rounded-full shadow-lg hover:bg-slate-800 transition duration-300 transform hover:scale-105"
          >
            ลงทะเบียน
          </button>
        </form>

        {/* Login and Home Links */}

        <div className="mt-4 text-center">
          <Link
            href="/"
            passHref
            className="inline-block w-full py-3 px-4 text-center font-semibold text-slate-600 bg-transparent border-2 border-slate-600 hover:bg-slate-600 hover:text-white rounded-full transition-colors duration-300 transform hover:scale-105"
          >
            กลับสู่หน้าหลัก
          </Link>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              passHref
              className="text-slate-600 hover:text-slate-800 font-medium transition duration-300"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
