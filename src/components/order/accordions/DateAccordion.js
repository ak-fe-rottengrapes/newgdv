'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from 'react';

export const DateAccordion = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <Accordion type="single" collapsible className="border-none rounded-lg bg-[#2b3a4a] hover:bg-[#192028] text-white">
            <AccordionItem value="date" className="border-none data-[state=open]:bg-[#192028] data-[state=open]:rounded-lg">
                <AccordionTrigger className="text-sm font-bold px-4">Date</AccordionTrigger>
                <AccordionContent className="px-4">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold mb-2">From</p>
                            <input
                                type="date"
                                className="p-1 w-full border text-sm border-gray-700 bg-transparent rounded-lg"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    colorScheme: "dark",
                                }}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-2">To</p>
                            <input
                                type="date"
                                className="p-1 w-full border text-sm border-gray-700 bg-transparent rounded-lg"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{
                                    colorScheme: "dark", 
                                }}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}; 