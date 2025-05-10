'use client';

import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/article", label: "Article" },
  { href: "/dashboard/lesson", label: "Lesson" },
  { href: "/dashboard/check_learning", label: "Check Learning" },
  { href: "/dashboard/worksheet", label: "Worksheet" }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">EduQuest Admin</h2>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-2 rounded hover:bg-indigo-600"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Link href="/logout" className="block hover:bg-indigo-600 p-2 rounded">Logout</Link>
      </div>
    </aside>
  )
}