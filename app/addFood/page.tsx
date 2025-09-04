"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AddFoodPage() {
  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    if (!foodName || !date || !imageFile) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    // Logic to save data (mock action for now)
    alert(`บันทึกรายการอาหาร: ${foodName}\nมื้อ: ${mealType}\nวันที่: ${date}`);
    // Reset form after saving
    setFoodName("");
    setMealType("Breakfast");
    setDate("");
    setImageFile(null);
    setImagePreview(null);
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
          เพิ่มรายการอาหาร
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10"
          >
            {/* Image Upload and Preview */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                รูปภาพอาหาร
              </label>
              <div className="flex justify-center items-center mb-4">
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    ไม่มีรูปภาพ
                  </div>
                )}
              </div>
              <label
                htmlFor="image-upload"
                className="w-full inline-block text-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-300 transform hover:scale-105 cursor-pointer"
              >
                เลือกรูปภาพ
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Food Name Input */}
            <div className="mb-6">
              <label
                htmlFor="foodName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                ชื่ออาหาร
              </label>
              <input
                type="text"
                id="foodName"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Meal Type Select */}
            <div className="mb-6">
              <label
                htmlFor="mealType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                มื้ออาหาร
              </label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            {/* Date Input */}
            <div className="mb-8">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                วันที่
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
