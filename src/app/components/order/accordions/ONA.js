'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ONA = () => {
    return (
        <Accordion type="single" collapsible className="border-none rounded-lg bg-[#2b3a4a] hover:bg-[#192028] text-white">
            <AccordionItem value="satellite" className="border-none data-[state=open]:bg-[#192028] data-[state=open]:rounded-lg">
                <AccordionTrigger className="text-sm font-bold px-4">ONA (off nadir angle)</AccordionTrigger>
                <AccordionContent className="px-4">
                    {/* Add satellite content */}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}; 