'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from 'react';
import { useTool } from "@/app/context/ToolContext";

export const DateAccordion = ({ isDisabled }) => {
    const { date_from, date_to, setDateFrom, setDateTo } = useTool();

    const handleStartDateChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 00:00:00`;
        setDateFrom(formattedDate);
    };

    const handleEndDateChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 00:00:00`;
        setDateTo(formattedDate);
    };

    return (
        <Accordion type="single" collapsible className="border-none rounded-lg bg-[#2b3a4a] hover:bg-[#192028] text-white">
            <AccordionItem value="date" className="border-none data-[state=open]:bg-[#192028] data-[state=open]:rounded-lg" disabled={isDisabled}>
                <AccordionTrigger className="text-sm font-bold px-4">Date</AccordionTrigger>
                <AccordionContent className="px-4">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold mb-2">From</p>
                            <input
                                type="date"
                                className="p-2 w-full border border-gray-600 bg-gray-800 text-white text-sm rounded-lg shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
             appearance-none cursor-pointer"
                                value={date_from ? date_from.split(' ')[0] : ""}
                                onChange={handleStartDateChange}
                                style={{
                                    colorScheme: "dark",
                                }}
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            />

                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-2">To</p>
                            <input
                                type="date"
                                className="p-2 w-full border border-gray-600 bg-gray-800 text-white text-sm rounded-lg shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
             appearance-none cursor-pointer"
                                value={date_to ? date_to.split(' ')[0] : ""}
                                onChange={handleEndDateChange}
                                style={{
                                    colorScheme: "dark",
                                }}
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};