import EditFoodClient from "./EditFoodClient";

export default async function Page({
  params,
}: {
  params: { id: string }; // Server Component
}) {
  // params ไม่ต้องเป็น Promise ใน server component
  return <EditFoodClient id={params.id} />;
}
