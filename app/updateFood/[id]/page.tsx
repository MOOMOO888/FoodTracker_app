// my-app-food\app\updateFood\[id]\page.tsx
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Mock API สำหรับดึงข้อมูลอาหารตาม ID
const fetchFoodById = async (id: string) => {
  // ตัวอย่าง mock API
  return {
    id,
    foodName: "Chicken Salad",
    mealType: "Lunch",
    date: "2024-05-15",
    imageUrl: "https://picsum.photos/id/237/400/300",
  };
};

export default function EditFoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const router = useRouter();

  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลอาหารตาม ID
  useEffect(() => {
    fetchFoodById(id).then((data) => {
      setFoodName(data.foodName);
      setMealType(data.mealType);
      setDate(data.date);
      setImagePreview(data.imageUrl);
      setLoading(false);
    });
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !date) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // TODO: เรียก API update จริงตาม ID
    alert(
      `แก้ไขรายการอาหาร ID: ${id} เรียบร้อยแล้ว:\nชื่อ: ${foodName}\nมื้อ: ${mealType}\nวันที่: ${date}`
    );

    router.push("/dashboard"); // กลับไป dashboard หลังบันทึก
  };

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-12">
      <div className="container mx-auto">
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
                    alt="Image Preview"
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
                className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
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
