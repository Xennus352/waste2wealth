'use client'

const mockData = [
  { id: 1, type: "Add", date: "2025-12-28", userId: "#12345", amount: 500 },
  { id: 2, type: "Transfer", date: "2025-12-27", userId: "#54321", amount: 200 },
  { id: 3, type: "Add", date: "2025-12-26", userId: "#67890", amount: 1000 },
];

export default function TransitionHistory() {
  return (
    <div className="space-y-4">
      {mockData.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
        >
          <div>
            <div className="text-gray-600 text-sm">{item.date}</div>
            <div className="font-semibold text-lg">
              {item.type === "Add" ? "Points Added" : "Points Transferred"}
            </div>
            <div className="text-gray-500 text-sm">User ID: {item.userId}</div>
          </div>

          <div
            className={`font-bold text-xl ${
              item.type === "Add" ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.type === "Add" ? "+" : "-"}{item.amount} pts
          </div>
        </div>
      ))}
    </div>
  );
}
