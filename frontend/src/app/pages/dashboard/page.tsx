import MainLayout from "@/component/layout/MainLayout";

export default function Dashboard() {
  const todos = [
    { id: 1, title: "Finish  Dashboard", expires_at: "2025-09-10" },
    { id: 2, title: "Start header", expires_at: "2025-09-11" },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4 text-blue-950 xl:text-2xl cursor-pointer"><span className="underline  decoration-2 underline-offset-2"><span className="text-4xl text-blue-500 font-[cursive]">W</span>elcome ba</span>ck, User 👋</h1>
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
      </div>

    </MainLayout>
  );
}
