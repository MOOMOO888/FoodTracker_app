"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProfileImageFile(null);
    const fileInput = document.getElementById(
      "profile-image"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl: string | null = null;

      if (profileImageFile) {
        const fileName = `${Date.now()}-${profileImageFile.name}`;
        const { error } = await supabase.storage
          .from("user_bk")
          .upload(fileName, profileImageFile);

        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("user_bk")
          .getPublicUrl(fileName);
        imageUrl = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase.from("user_tb").insert([
        {
          fullname: formData.name,
          email: formData.email,
          password: formData.password, // ❗เข้ารหัสใน production
          gender: formData.gender,
          user_image_url: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

      // ✅ แทน alert ให้ redirect ไปหน้า login
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Register error:", err.message);
        alert("เกิดข้อผิดพลาด: " + err.message);
      } else {
        console.error("Unknown error:", err);
        alert("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      }
    }
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
          {/* Upload Image */}
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  fill
                  style={{ objectFit: "cover" }}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3"
            >
              <option value="">เลือกเพศ...</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-slate-700 text-white font-semibold rounded-full shadow-lg hover:bg-slate-800 transition duration-300 transform hover:scale-105"
          >
            ลงทะเบียน
          </button>
        </form>

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
              className="text-slate-600 hover:text-slate-800 font-medium"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
