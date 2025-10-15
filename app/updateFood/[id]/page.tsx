import EditFoodClient from "./EditFoodClient";

// ✅ ต้อง async และ await params (Next.js 15)
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditFoodClient id={id} />;
}
