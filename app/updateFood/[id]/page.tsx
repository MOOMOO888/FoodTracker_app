// app/updateFood/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { createClient } from "@supabase/supabase-js";

// 🔹 ตั้งค่า Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditFoodPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("");
  const [date, setDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลอาหารจาก Supabase
  useEffect(() => {
    const fetchFoodById = async () => {
      const { data, error } = await supabase
        .from("food_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
      } else if (data) {
        setFoodName(data.foodname || "");
        setMealType(data.mealtype || "");
        setDate(data.date || "");
        setImagePreview(data.food_image_url || null);
      }
      setLoading(false);
    };

    fetchFoodById();
  }, [id]);

  // เมื่อเลือกรูปภาพใหม่
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // อัปเดตข้อมูล
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName || !date) {
      Swal.fire("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning");
      return;
    }

    setLoading(true);

    let imageUrl = imagePreview;

    // ถ้ามีการเลือกรูปใหม่ → อัปโหลด Supabase
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("food_bk")
        .upload(fileName, imageFile);

      if (uploadError) {
        setLoading(false);
        Swal.fire(
          "เกิดข้อผิดพลาดในการอัปโหลดรูป",
          uploadError.message,
          "error"
        );
        return;
      }

      // ดึง URL จริง
      const { data: urlData } = supabase.storage
        .from("food_bk")
        .getPublicUrl(fileName);
      imageUrl = urlData?.publicUrl || null;
    }

    // อัปเดตข้อมูลใน database
    const { error } = await supabase
      .from("food")
      .update({
        foodname: foodName,
        mealtype: mealType,
        date,
        food_image_url: imageUrl,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
    } else {
      Swal.fire({
        title: "บันทึกสำเร็จ!",
        text: "ข้อมูลถูกอัปเดตแล้ว ✅",
        icon: "success",
        confirmButtonColor: "#1e293b",
      }).then(() => router.push("/dashboard"));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white">
        <p className="text-lg animate-pulse">กำลังโหลดข้อมูล...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-12">
      <div className="container mx-auto relative">
        <Link
          href="/dashboard"
          className="absolute top-6 left-6 flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors duration-300"
        >
          ← กลับไปแดชบอร์ด
        </Link>

        <h1 className="text-4xl font-extrabold text-center mb-10">
          แก้ไขรายการอาหาร
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10 space-y-6"
          >
            {/* รูปอาหาร */}
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-4">
                  <Image
                    src={imagePreview}
                    alt="Food Image"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-full h-64 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 mb-4">
                  ไม่มีรูปภาพ
                </div>
              )}
              <label className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-full shadow-lg hover:bg-slate-700 cursor-pointer">
                เปลี่ยนรูปภาพ
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* ชื่ออาหาร */}
            <div>
              <label className="block mb-2 font-medium">ชื่ออาหาร</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>

            {/* มื้ออาหาร */}
            <div>
              <label className="block mb-2 font-medium">มื้ออาหาร</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="Breakfast">อาหารเช้า</option>
                <option value="Lunch">อาหารกลางวัน</option>
                <option value="Dinner">อาหารเย็น</option>
                <option value="Snack">ของว่าง</option>
              </select>
            </div>

            {/* วันที่ */}
            <div>
              <label className="block mb-2 font-medium">วันที่</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
