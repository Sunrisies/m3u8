"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  Play,
  Home,
  Video,
  Menu,
  User,
  Settings,
  LogOut,
  History,
  Heart,
  Clock,
  TrendingUp as Trending,
  Music,
  Gamepad2,
  BookOpen,
  Utensils,
  Dumbbell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/videos", label: "Browse", icon: Video },
    { href: "/trending", label: "Trending", icon: Trending },
    { href: "/categories/music", label: "Music", icon: Music },
    { href: "/categories/gaming", label: "Gaming", icon: Gamepad2 },
    { href: "/categories/education", label: "Education", icon: BookOpen },
    { href: "/categories/cooking", label: "Cooking", icon: Utensils },
    { href: "/categories/fitness", label: "Fitness", icon: Dumbbell },
  ]

  const userMenuItems = [
    { href: "/profile", label: "Your Profile", icon: User },
    { href: "/history", label: "Watch History", icon: History },
    { href: "/liked", label: "Liked Videos", icon: Heart },
    { href: "/watchlater", label: "Watch Later", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results
      console.log("Searching for:", searchQuery)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 border-b p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Play className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">StreamHub</span>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                          pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                {/* 移动端主题切换 */}
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">主题模式</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Play className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">StreamHub</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.slice(0, 3).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
          <form onSubmit={handleSearch} className="relative">
            <div
              className={cn(
                "relative transition-all duration-200",
                isSearchFocused ? "ring-2 ring-primary/20 rounded-full" : "",
              )}
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search videos, creators, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-2 rounded-full border-2 focus:border-primary/20"
              />
              {searchQuery && (
                <Button type="submit" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-4">
                  Search
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle - 显眼位置 */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">John Doe</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />

              {userMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
