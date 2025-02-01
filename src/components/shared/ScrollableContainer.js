'use client';
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";

export function ScrollableContainer({ children, className }) {
  return (
    <ScrollArea className={`rounded-md ${className}`}>
      <div className="p-4">
        {children}
      </div>
    </ScrollArea>
  );
} 