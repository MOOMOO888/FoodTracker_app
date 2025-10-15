"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient"; // ตรวจสอบว่ามีไฟล์นี้แล้ว

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ดึงผู้ใช้จาก database
      const { data, error } = await supabase
        .from("user_tb")
        .select("*")
        .eq("email", formData.email)
        .eq("password", formData.password) // ⚠️ production ต้อง hash password
        .single();

      if (error || !data) {
        throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง ❌");
      }

      // เก็บ session แบบง่าย
      localStorage.setItem("loggedInUser", JSON.stringify(data));

      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "กำลังพาคุณไปที่ Dashboard 🚀",
        icon: "success",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#1e293b",
      }).then(() => {
        router.push("/dashboard");
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: err.message,
          icon: "error",
          confirmButtonText: "ลองใหม่",
        });
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-2">
          เข้าสู่ระบบ
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          เข้าสู่บัญชีของคุณเพื่อดำเนินการต่อ
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 px-4 bg-slate-700 text-white font-semibold rounded-full shadow-lg hover:bg-slate-800 transition duration-300 transform hover:scale-105"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-block w-full py-3 px-4 text-center font-semibold text-slate-600 bg-transparent border-2 border-slate-600 hover:bg-slate-600 hover:text-white rounded-full transition-colors duration-300 transform hover:scale-105"
          >
            กลับสู่หน้าหลัก
          </Link>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <Link
              href="/register"
              className="text-slate-600 hover:text-slate-800 font-medium transition duration-300"
            >
              ลงทะเบียนที่นี่
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
