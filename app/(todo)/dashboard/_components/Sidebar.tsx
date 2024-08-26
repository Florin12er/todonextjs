"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  ListCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  {
    label: "Tasks",
    icon: ListCheck,
    href: "/dashboard/tasks",
  },
  {
    label: "Today",
    icon: CalendarCheck,
    href: "/dashboard/today",
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
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          size="icon"
          variant="ghost"
          className={cn(
            "fixed top-4 left-4 z-50 bg-opacity-80 backdrop-blur-sm transition-all duration-300",
            isOpen ? "left-[280px]" : "left-4",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out",
          isOpen ? `w-[${width}px]` : "w-0",
        )}
        style={{ width: isOpen ? width : 0 }}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center">
            <h1 className={cn("text-2xl font-bold", isOpen ? "" : "hidden")}>
              TodoApp
            </h1>
          </Link>
          {isOpen && (
            <Button
              onClick={() => setIsOpen(false)}
              variant="transparent"
              className="ml-2"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        <nav className="flex-1 space-y-2 px-4 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                pathname === route.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
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
          <div className="border-t border-gray-800 px-4 py-4">
            <ThemeToggle />
            <div className="mt-4 flex items-center">
              <UserButton />
              <span className="ml-2 text-sm font-medium">Profile</span>
            </div>
          </div>
        )}
        {!isMobile && (
          <div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-800 hover:bg-gray-700"
            onMouseDown={handleMouseDown}
          />
        )}
      </aside>
    </>
  );
}
