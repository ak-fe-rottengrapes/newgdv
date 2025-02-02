'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useTool } from "@/app/context/ToolContext";
import { useEffect } from "react";

export const AdditionalAccordion = () => {
    const { note, setNote } = useTool();

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    return (
        <Accordion type="single" collapsible className="border-none rounded-lg bg-[#2b3a4a] hover:bg-[#192028] text-white">
            <AccordionItem value="additional" className="border-none data-[state=open]:bg-[#192028] data-[state=open]:rounded-lg">
                <AccordionTrigger className="text-sm font-bold px-4">Additional Notes</AccordionTrigger>
                <AccordionContent className="px-4">
                    <Textarea 
                        placeholder="Additional Notes"
                        value={note}
                        onChange={handleNoteChange}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};