'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const AdditionalAccordion = () => {
    return (
        <Accordion type="single" collapsible className="border-none rounded-lg bg-[#2b3a4a] hover:bg-[#192028] text-white">
            <AccordionItem value="additional" className="border-none data-[state=open]:bg-[#192028] data-[state=open]:rounded-lg">
                <AccordionTrigger className="text-sm font-bold px-4">Additional Notes</AccordionTrigger>
                <AccordionContent className="px-4">
                    {/* Add additional parameters content */}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}; 