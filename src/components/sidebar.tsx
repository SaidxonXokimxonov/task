import { FolderClosed, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { logout } from "@/store/reducers/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const items = [
  { title: "cars", url: "/cars", icon: FolderClosed },
  { title: "loads", url: "/loads", icon: FolderClosed },
];

export function AppSidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);

  const signOut = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  if (!token) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:block w-[230px] h-screen bg-white dark:bg-gray-900">
        <SidebarContent>
          <div>
            <h2 className="text-center text-xl mt-3">Dashboard</h2>
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`transition-colors duration-150 ${
                          isActive
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        }`}
                      >
                        <a
                          className="flex items-center gap-3 text-[16px] px-3 py-2 rounded-md"
                          href={item.url}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
          <SidebarFooter>
            <Button onClick={signOut} className="w-full">
              <LogOut className="mr-2" /> Logout
            </Button>
          </SidebarFooter>
      </Sidebar>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around items-center h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={`flex flex-col items-center justify-center text-xs ${
                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span>{item.title}</span>
            </button>
          );
        })}

        {/* Logout button */}
        <button
          onClick={signOut}
          className="flex flex-col items-center justify-center text-xs text-red-500 dark:text-red-400"
        >
          <LogOut className="w-6 h-6 mb-1" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}
