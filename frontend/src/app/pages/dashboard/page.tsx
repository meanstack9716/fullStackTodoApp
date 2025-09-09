import Header from "@/component/layout/Header";
import Sidebar from "@/component/layout/Sidebar";

export default function Dashboard() {
  const todos = [
    { id: 1, title: "Finish  Dashboard", expires_at: "2025-09-10" },
    { id: 2, title: "Start header", expires_at: "2025-09-11" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar user={{ name: "Hello User", email: "usertest@gmail.com" }} />

        {/* Main Section */}
        <main className="flex-1 bg-gray-50 p-6">
          <h1 className="text-xl font-bold mb-4 text-blue-950 xl:text-2xl">Welcome back, User 👋</h1>

          {/* Render todos */}
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li key={todo.id} className="p-4 bg-white rounded-lg shadow">
                <div className="font-semibold text-gray-500">{todo.title}</div>
                <div className="text-sm text-gray-500">
                  Expires: {todo.expires_at}
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
