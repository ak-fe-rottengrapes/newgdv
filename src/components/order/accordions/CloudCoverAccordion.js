'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTool } from '@/app/context/ToolContext';

export const CloudCoverAccordion = ({ isDisabled, onValueChange }) => {
  const { cloud_cover_percentage, setCloudCoverPercentage } = useTool();
  const [value, setValue] = useState(cloud_cover_percentage || 10);

  const handleValueChange = (newValue) => {
    const newPercentage = newValue[0];
    setValue(newPercentage);
    setCloudCoverPercentage(newPercentage);
    onValueChange?.(newPercentage);
  };

  return (
    <TooltipProvider>
      <Accordion 
        type="single" 
        collapsible 
        className="rounded-lg bg-[#2b3a4a] hover:bg-[#192028] transition-colors duration-200 text-white"
      >
        <AccordionItem 
          value="cloudcover" 
          className="border-none data-[state=open]:bg-[#192028]"
          disabled={isDisabled}
        >
          <AccordionTrigger className="text-sm font-bold px-4 py-3">
            <div className="flex items-center gap-2">
              Cloud Cover
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-6">
            <div className="relative pt-6 px-2 mt-2">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                {value}%
              </div>
              <Slider
                value={[value]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleValueChange}
                className="w-full bg-grey-800 focus:bg-white"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default CloudCoverAccordion;