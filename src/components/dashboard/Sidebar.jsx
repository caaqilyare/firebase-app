import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Box,
  Tag
} from "lucide-react"

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      tab: "dashboard"
    },
    {
      name: "Categories",
      icon: Tag,
      tab: "categories"
    },
    {
      name: "Items",
      icon: Box,
      tab: "items"
    }
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10">
              <ListTodo className="h-8 w-8 p-1.5 text-primary" />
            </div>
            <span className="text-lg font-semibold">Inventory</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-8 w-8",
            !isOpen && "mx-auto"
          )}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.tab}
              variant={activeTab === item.tab ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                !isOpen && "justify-center px-0"
              )}
              onClick={() => setActiveTab(item.tab)}
            >
              <Icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
              {isOpen && <span className="ml-2">{item.name}</span>}
            </Button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            !isOpen && "justify-center px-0"
          )}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className={cn("h-5 w-5", !isOpen && "mx-auto")} />
          {isOpen && <span className="ml-2">Settings</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive",
            !isOpen && "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5", !isOpen && "mx-auto")} />
          {isOpen && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
