"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ListTodo,
    CalendarDays,
    Settings,
    SidebarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SearchCommand } from "./SearchCommand";
import { AddTaskButton } from "./AddTaskButton";
import { ProjectsList } from "./ProjectList";
import { FavoriteProjectsList } from "./FavoriteList";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Tasks",
        icon: ListTodo,
        href: "/dashboard/tasks",
    },
    {
        label: "Calendar",
        icon: CalendarDays,
        href: "/dashboard/calendar",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
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
                variant="transparent"
                className={cn(
                    "fixed top-4 left-4 z-50 bg-white",
                    isOpen && "left-56 bg-gray-900",
                )}
            >
                {isOpen ? (
                    <SidebarIcon className="h-4 w-4 text-white" />
                ) : (
                    <SidebarIcon className="h-4 w-4 text-black" />
                )}
            </Button>
            <aside
                ref={sidebarRef}
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out",
                    isOpen ? `w-[${width}px]` : "w-0",
                )}
                style={{ width: isOpen ? width : 0 }}
            >
                <div className="flex items-center justify-between p-4">
                    <Link href="/dashboard" className="flex items-center">
                        <h1 className={cn("text-2xl font-bold", isOpen ? "" : "hidden")}>
                            TodoApp
                        </h1>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
                                pathname === route.href
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:bg-transparent hover:text-white",
                                !isOpen && "justify-center",
                            )}
                        >
                            <route.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
                            {isOpen && route.label}
                        </Link>
                    ))}
                    {isOpen && <SearchCommand />}
                    <div className="hidden">
                        <SearchCommand />
                    </div>
                    {isOpen && <AddTaskButton />}
                    <div className="hidden">
                        <AddTaskButton />
                    </div>
                    {isOpen && <FavoriteProjectsList />}
                    <div className="hidden">
                        <FavoriteProjectsList />
                    </div>
                    {isOpen && <ProjectsList />}
                    <div className="hidden">
                        <ProjectsList />
                    </div>
                </nav>
                {isOpen && (
                    <div className="px-3 py-2">
                        <div className="mt-4 flex items-center">
                            <UserButton />
                            <span className="ml-2">Profile</span>
                        </div>
                    </div>
                )}
                {!isMobile && (
                    <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize"
                        onMouseDown={handleMouseDown}
                    />
                )}
            </aside>
        </>
    );
}
