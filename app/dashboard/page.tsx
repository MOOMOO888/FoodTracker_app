"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface FoodEntry {
  id: string;
  foodname: string | null;
  mealtype: string | null;
  fooddate_at: string | null;
  food_image_url: string | null;
  user_id: string;
}

interface UserProfile {
  id: string;
  fullname: string | null;
  user_image_url: string | null;
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // ตรวจสอบ login
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      router.push("/login");
      return;
    }
    setUserProfile(JSON.parse(user));
  }, [router]);

  // ดึงข้อมูลอาหารจาก Supabase **เฉพาะ client-side**
  useEffect(() => {
    const fetchFoodEntries = async () => {
      if (!userProfile) return;

      try {
        const { data, error } = await supabase
          .from("food_tb")
          .select("*")
          .eq("user_id", userProfile.id)
          .order("fooddate_at", { ascending: false });

        if (error) throw error;
        setFoodEntries(data as FoodEntry[]);
      } catch (err: unknown) {
        // Narrow type
        const message =
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
        Swal.fire("เกิดข้อผิดพลาด", message, "error");
      }
    };

    fetchFoodEntries();
  }, [userProfile]);

  // Filter + Pagination
  const filteredEntries = foodEntries.filter((entry) =>
    entry.foodname?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Edit
  const handleEdit = (id: string) => {
    Swal.fire({
      title: "แก้ไขรายการอาหาร",
      text: `คุณต้องการแก้ไขรายการอาหาร ID: ${id} หรือไม่?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "แก้ไข",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3B82F6",
    }).then((result) => {
      if (result.isConfirmed) router.push(`/updateFood/${id}`);
    });
  };

  // Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "ลบรายการอาหาร",
      text: `คุณแน่ใจว่าต้องการลบรายการอาหาร ID: ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#EF4444",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("food_tb").delete().eq("id", id);
      if (error) Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
      else setFoodEntries(foodEntries.filter((item) => item.id !== id));
    }
  };

  // Logout
  const handleLogout = () => {
    Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณแน่ใจว่าต้องการออกจากระบบ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่ ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#EF4444",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("loggedInUser");
        router.push("/login");
      }
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-10">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-300"
          >
            <span className="text-lg md:text-xl font-medium hidden md:inline">
              กลับสู่หน้าหลัก
            </span>
          </Link>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl font-extrabold">
            แดชบอร์ด
          </h1>

          <div className="flex items-center space-x-4">
            {userProfile?.user_image_url && (
              <Image
                src={userProfile.user_image_url}
                alt={userProfile.fullname ?? "User"}
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
              />
            )}
            <span className="font-semibold">{userProfile?.fullname}</span>
            <button
              onClick={handleLogout}
              className="group flex items-center w-14 h-10 bg-red-500 text-white rounded-full shadow-lg overflow-hidden transition-all duration-300 hover:w-42 px-2"
            >
              <span className="ml-2 font-semibold whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                ออกจากระบบ
              </span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="ค้นหาชื่ออาหาร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
            />
          </div>
          <Link href="/addFood" passHref className="w-full md:w-auto">
            <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              + เพิ่มอาหาร
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  วันที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  รูปอาหาร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ชื่ออาหาร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  มื้ออาหาร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {entry.fooddate_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.food_image_url ? (
                        <Image
                          src={entry.food_image_url}
                          alt={entry.foodname ?? "Food"}
                          width={100}
                          height={70}
                          className="rounded-3xl object-cover w-60 h-40"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                          ไม่มีรูป
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.foodname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.mealtype}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        onClick={() => handleEdit(entry.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    ไม่พบรายการอาหาร
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-full text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
          >
            ก่อนหน้า
          </button>
          <div className="text-sm">
            หน้า {currentPage} จาก {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-full text-slate-700 dark:text-slate-300 border-slate-700 dark:border-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </main>
  );
}
