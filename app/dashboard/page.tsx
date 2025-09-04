"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data for demonstration
const mockFoodEntries = [
  {
    id: 1,
    date: "2024-05-15",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Chicken Salad",
    mealType: "Lunch",
  },
  {
    id: 2,
    date: "2024-05-15",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Yogurt with Berries",
    mealType: "Breakfast",
  },
  {
    id: 3,
    date: "2024-05-14",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Stir-fried Vegetables",
    mealType: "Dinner",
  },
  {
    id: 4,
    date: "2024-05-14",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Beef Steak",
    mealType: "Lunch",
  },
  {
    id: 5,
    date: "2024-05-13",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Grilled Fish",
    mealType: "Dinner",
  },
  {
    id: 6,
    date: "2024-05-13",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Oatmeal",
    mealType: "Breakfast",
  },
  {
    id: 7,
    date: "2024-05-12",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Pasta with Tomato Sauce",
    mealType: "Lunch",
  },
  {
    id: 8,
    date: "2024-05-12",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Fruit Smoothie",
    mealType: "Breakfast",
  },
  {
    id: 9,
    date: "2024-05-11",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Salmon",
    mealType: "Dinner",
  },
  {
    id: 10,
    date: "2024-05-11",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Tuna Sandwich",
    mealType: "Lunch",
  },
  {
    id: 11,
    date: "2024-05-10",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Green Tea",
    mealType: "Breakfast",
  },
  {
    id: 12,
    date: "2024-05-10",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Chicken Soup",
    mealType: "Dinner",
  },
  {
    id: 13,
    date: "2024-05-09",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Sushi",
    mealType: "Lunch",
  },
  {
    id: 14,
    date: "2024-05-09",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Miso Soup",
    mealType: "Dinner",
  },
  {
    id: 15,
    date: "2024-05-08",
    imageUrl: "https://picsum.photos/id/237/200/300",
    foodName: "Pancakes",
    mealType: "Breakfast",
  },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter food entries based on search term
  const filteredEntries = mockFoodEntries.filter((entry) =>
    entry.foodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (id: number) => {
    alert(`แก้ไขรายการอาหาร ID: ${id}`);
    // In a real app, this would redirect to an edit page or open a modal.
  };

  const handleDelete = (id: number) => {
    alert(`ลบรายการอาหาร ID: ${id}`);
    // In a real app, this would trigger a deletion and UI update.
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-white p-6 md:p-12">
      <div className="container mx-auto">
        <Link
          href="/"
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
          <span className="font-medium">กลับสู่หน้าหลัก</span>
        </Link>
        <h1 className="text-4xl font-extrabold text-center mb-10">แดชบอร์ด</h1>

        {/* Action Bar: Search and Add Food Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="ค้นหาชื่ออาหาร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {/* Search Icon (Inline SVG) */}
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
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
          <Link href="/addfood" passHref className="w-full md:w-auto">
            <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              + เพิ่มอาหาร
            </button>
          </Link>
        </div>

        {/* Food Entries Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  วันที่
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  รูปอาหาร
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  ชื่ออาหาร
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  มื้ออาหาร
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
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
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={entry.imageUrl}
                        alt={entry.foodName}
                        width={100}
                        height={70}
                        className="rounded-3xl object-cover w-60 h-40"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.foodName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {entry.mealType}
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

        {/* Pagination Controls */}
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

        <div className="mt-12 text-center"></div>
      </div>
    </main>
  );
}
