"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";

export default function AddFoodPage() {
  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔹 ดึง user id จาก localStorage
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      Swal.fire("กรุณาล็อกอินก่อน", "", "warning");
      return;
    }
    setUserId(JSON.parse(user).id);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !date || !imageFile || !userId) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบถ้วน", "", "error");
      return;
    }

    // อัปโหลดรูปภาพ
    let image_url: string | null = null;
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("food_bk")
      .upload(fileName, imageFile);

    if (uploadError) {
      Swal.fire("เกิดข้อผิดพลาดในการอัปโหลดรูป", uploadError.message, "error");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("food_bk")
      .getPublicUrl(fileName);
    image_url = urlData?.publicUrl || null;

    // บันทึกลง database
    const { error } = await supabase.from("food_tb").insert([
      {
        foodname: foodName,
        mealtype: mealType,
        date,
        food_image_url: image_url,
        user_id: userId,
      },
    ]);

    if (error) {
      Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
    } else {
      Swal.fire("บันทึกสำเร็จ!", "", "success");
      // Reset form
      setFoodName("");
      setMealType("Breakfast");
      setDate("");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-12">
      <div className="container mx-auto">
        <Link
          href="/dashboard"
          className="absolute top-6 left-6 text-slate-600 hover:text-slate-800"
        >
          กลับไปแดชบอร์ด
        </Link>

        <h1 className="text-4xl font-extrabold text-center mb-10">
          เพิ่มรายการอาหาร
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10"
          >
            {/* Image Upload */}
            <div className="mb-8">
              <label className="block mb-2">รูปภาพอาหาร</label>
              {imagePreview ? (
                <div className="w-full h-64 relative rounded-xl overflow-hidden mb-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="w-full h-64 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                  ไม่มีรูปภาพ
                </div>
              )}
              <label className="w-full inline-block text-center px-6 py-3 bg-slate-600 text-white rounded-full cursor-pointer">
                เลือกรูปภาพ
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Food Name */}
            <input
              type="text"
              placeholder="ชื่ออาหาร"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border dark:bg-gray-700"
              required
            />

            {/* Meal Type */}
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border dark:bg-gray-700"
              required
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>

            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border dark:bg-gray-700"
              required
            />

            {/* Save Button */}
            <button className="w-full py-4 bg-green-600 text-white rounded-full">
              บันทึก
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
