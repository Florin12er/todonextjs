"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SearchCommand } from "./SearchCommand";
import { AddTaskButton } from "./AddTaskButton";
import { ProjectsList } from "./ProjectList";
import { FavoriteProjectsList } from "./FavoriteList";
import { ThemeToggle } from "@/app/_components/ThemeToggle";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
];

const MIN_WIDTH = 280;
const MAX_WIDTH = 480;

export default function Sidebar({
  onWidthChange,
}: {
  onWidthChange: (width: number) => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(MIN_WIDTH);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      onWidthChange(0);
    } else {
      setIsOpen(true);
      onWidthChange(width);
    }
  }, [isMobile, width, onWidthChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (sidebarRef.current) {
      const newWidth =
        e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
        onWidthChange(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onWidthChange(isOpen ? 0 : width);
  };

  return (
    <>
      <Button
        onClick={toggleSidebar}
        size="icon"
        variant="ghost"
        className={cn(
          "fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-lg",
          isOpen ? "left-[280px]" : "left-4",
        )}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 ease-in-out shadow-xl",
          isOpen ? `w-[${width}px]` : "w-0",
        )}
        style={{ width: isOpen ? width : 0 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center">
            <h1 className={cn("text-2xl font-bold", isOpen ? "" : "hidden")}>
              TodoApp
            </h1>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-4 overflow-y-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                pathname === route.href
                  ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400",
                !isOpen && "justify-center",
              )}
            >
              <route.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
              {isOpen && route.label}
            </Link>
          ))}
          {isOpen && (
            <>
              <SearchCommand />
              <AddTaskButton />
              <FavoriteProjectsList />
              <ProjectsList />
            </>
          )}
        </nav>
        {isOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <ThemeToggle />
            <div className="mt-4 flex items-center">
              <UserButton />
              <span className="ml-2 text-sm font-medium">Profile</span>
            </div>
          </div>
        )}
        {!isMobile && (
          <div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onMouseDown={handleMouseDown}
          />
        )}
      </aside>
    </>
  );
}
