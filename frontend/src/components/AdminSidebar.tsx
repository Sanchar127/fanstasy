"use client"; // Important: mark this as a client component

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "League", href: "/admin/league" },
  { name: "Teams", href: "/admin/team" },
  { name: "Matches", href: "/admin/match" },
  { name: "Players", href: "/admin/player" },
];

export default function AdminSidebar() {
  const pathname = usePathname(); // replaces useRouter().pathname

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} legacyBehavior> 
            <a
              className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors ${
                pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </a>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-gray-700">
        <button
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition-colors"
          onClick={() => {
            // Add logout functionality here
            console.log("Logging out...");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
