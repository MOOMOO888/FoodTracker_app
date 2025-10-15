import EditFoodClient from "./EditFoodClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ ต้อง await ก่อนใช้งาน
  return <EditFoodClient id={id} />;
}
