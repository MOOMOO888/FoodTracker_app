"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      Swal.fire("กรุณาล็อกอินก่อน", "", "warning").then(() => {
        router.push("/login");
      });
      return;
    }

    const parsedUser = JSON.parse(storedUser) as UserProfile;
    setUser(parsedUser);
    setFirstName(parsedUser.firstName);
    setLastName(parsedUser.lastName);
    setEmail(parsedUser.email);
    setImagePreview(parsedUser.profileImageUrl);
  }, [router]);

  // Handle image change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Handle form submit
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let profileImageUrl = user.profileImageUrl;

      // Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `profile_${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile_images")
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) {
          Swal.fire(
            "เกิดข้อผิดพลาดในการอัปโหลดรูป",
            uploadError.message,
            "error"
          );
          return;
        }

        const { data: urlData } = supabase.storage
          .from("profile_images")
          .getPublicUrl(fileName);

        profileImageUrl = urlData?.publicUrl || null;
      }

      // Update user data in Supabase
      const { error: updateError } = await supabase
        .from("users")
        .update({
          firstName,
          lastName,
          email,
          profileImageUrl,
        })
        .eq("id", user.id);

      if (updateError) {
        Swal.fire("เกิดข้อผิดพลาด", updateError.message, "error");
        return;
      }

      // Update localStorage
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        email,
        profileImageUrl,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      Swal.fire("บันทึกสำเร็จ!", "", "success").then(() => {
        router.push("/dashboard");
      });
    } catch (err) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  if (!user) return null; // หรือ loader

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
          แก้ไขโปรไฟล์
        </h1>

        <div className="flex justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10"
          >
            {/* Profile Image */}
            <div className="mb-8 flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                รูปโปรไฟล์
              </label>
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden shadow-lg border-2 border-slate-300">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
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

            {/* First Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ชื่อ
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                นามสกุล
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                อีเมล
              </label>
              <input
                type="email"
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
