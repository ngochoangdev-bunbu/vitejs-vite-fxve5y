"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const currentRoute = usePathname();

  const menuItems = [
    { href: "/admin/admin-users", label: "管理者一覧" },
    { href: "/admin/users", label: "会員一覧" },
    { href: "/admin/reservations", label: "予約一覧" },
    { href: "/admin/mail-templates", label: "メールテンプレート" },
    { href: "/admin/estimates", label: "見積書一覧" },
    { href: "/admin/invoices", label: "請求書一覧" },
    { href: "/admin/master", label: "マスターデータ一覧" },
  ];

  return (
    <aside id="default-sidebar" className="w-60 bg-white p-4">
      <div className="h-full">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg group text-nowrap ${
                  currentRoute === item.href
                    ? "text-white bg-blue-600"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="ms-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
