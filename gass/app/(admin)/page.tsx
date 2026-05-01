// app/(admin)/page.tsx
export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        Quản trị Gass growby  
      </h1>
      <p className="text-gray-600">
        Nhấn nút <strong>Menu</strong> để thu/phóng Sidebar.
      </p>
    </div>
  );
}
