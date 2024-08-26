"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface SearchModalProps extends DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({
  open,
  onOpenChange,
  ...props
}: SearchModalProps) {
  const router = useRouter();

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandPrimitive.Input
            placeholder="Type a command or search..."
            className="h-12 w-full border-none bg-transparent p-3 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <CommandPrimitive.List>
            <CommandPrimitive.Empty>No results found.</CommandPrimitive.Empty>
            <CommandPrimitive.Group heading="Suggestions">
              <CommandPrimitive.Item
                onSelect={() => runCommand(() => router.push("/dashboard"))}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandPrimitive.Item>
              <CommandPrimitive.Item
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/tasks"))
                }
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <ListTodo className="mr-2 h-4 w-4" />
                <span>Tasks</span>
              </CommandPrimitive.Item>
              <CommandPrimitive.Item
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/calendar"))
                }
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandPrimitive.Item>
              <CommandPrimitive.Item
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/settings"))
                }
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandPrimitive.Item>
            </CommandPrimitive.Group>
          </CommandPrimitive.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
