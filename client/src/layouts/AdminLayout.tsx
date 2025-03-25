import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Settings, LogOut, MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, current: location === "/admin" },
    { name: "Proposals", href: "/admin", icon: FileText, current: location.startsWith("/admin/proposals") },
    { name: "Settings", href: "/admin/settings", icon: Settings, current: location === "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="h-8 flex items-center">
                <span className="font-heading font-bold text-xl text-primary-700">CIBER</span>
                <span className="font-heading font-bold text-xl text-cyan-600">EHD</span>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`${
                      item.current
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        item.current ? "text-primary-500" : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link href="/">
              <a className="flex items-center text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5 mr-2" />
                <span>Exit Admin</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-8 flex items-center">
                <span className="font-heading font-bold text-xl text-primary-700">CIBER</span>
                <span className="font-heading font-bold text-xl text-cyan-600">EHD</span>
              </div>
            </div>
            <div className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`${
                      item.current
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        item.current ? "text-primary-500" : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link href="/">
              <a className="flex items-center text-gray-600 hover:text-gray-900">
                <LogOut className="h-5 w-5 mr-2" />
                <span>Exit Admin</span>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
