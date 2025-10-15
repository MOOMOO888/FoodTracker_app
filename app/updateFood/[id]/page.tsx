"use client";

import EditFoodClient from "./EditFoodClient";
import { use } from "react"; // React 18+ / Next.js 15+

interface Params {
  id: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const { id } = use(params); // unwrap promise
  return <EditFoodClient id={id} />;
}
