'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTool } from '@/app/context/ToolContext';

const operatorOptions = [
  {
    id: 'jilin',
    label: 'JILIN',
    value: 'JILIN',
    imagePath: '/assets/operators/Maxar.png'
  },
  {
    id: 'maxar',
    label: 'Maxar',
    value: 'Maxar',
    imagePath: '/assets/operators/Maxar.png'
  },
  {
    id: 'airbus',
    label: 'Airbus',
    value: 'Airbus',
    imagePath: '/assets/operators/Airbus.png'
  },
  {
    id: 'sentinel',
    label: 'Sentinel',
    value: 'Sentinel',
    imagePath: '/assets/operators/Sentinel.png'
  },
  {
    id: 'kompsat',
    label: 'Kompsat',
    value: 'Kompsat',
    imagePath: '/assets/operators/Kompsat.png'
  },
  {
    id: 'blacksky',
    label: 'BlackSky',
    value: 'BlackSky',
    imagePath: '/assets/operators/BlackSky.png'
  }
];

export const SelectOperatorAccordion = ({ isDisabled = false, onOperatorChange }) => {
  const { operators, setOperators } = useTool();
  const [selectedOperators, setSelectedOperators] = useState([]);

  const handleOperatorChange = (value) => {
    let updatedOperators;
    if (selectedOperators.includes(value)) {
      updatedOperators = selectedOperators.filter(operator => operator !== value);
    } else {
      updatedOperators = [...selectedOperators, value];
    }
    setSelectedOperators(updatedOperators);
    setOperators(updatedOperators);
    onOperatorChange?.(updatedOperators);
  };

  return (
    <TooltipProvider>
      <Accordion 
        type="single" 
        collapsible 
        className="rounded-lg bg-[#2b3a4a] hover:bg-[#192028] transition-colors duration-200 text-white"
      >
        <AccordionItem 
          value="operator" 
          className="border-none data-[state=open]:bg-[#192028]"
          disabled={isDisabled}
        >
          <AccordionTrigger className="text-sm font-bold px-4 py-3">
            <div className="flex items-center gap-2">
              Select Operator
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-4">
              {operatorOptions.map((operator) => (
                <div key={operator.id} className="relative">
                  <label 
                    className="block cursor-pointer group"
                    htmlFor={operator.id}
                  >
                    <input
                      type="checkbox"
                      id={operator.id}
                      value={operator.value}
                      name="operator"
                      checked={selectedOperators.includes(operator.value)}
                      onChange={() => handleOperatorChange(operator.value)}
                      className="hidden peer"
                    />
                    <div className="relative overflow-hidden rounded-lg border-2 border-transparent transition-all duration-200 peer-checked:border-blue-500 peer-checked:shadow-lg">
                      <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 peer-checked:opacity-0"></div>
                      <Image 
                        src={operator.imagePath} 
                        width={200} 
                        height={150} 
                        alt={`${operator.label} logo`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute bottom-2 left-2 flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white transition-colors duration-200 peer-checked:bg-white flex items-center justify-center">
                          <div className={`h-2 w-2 rounded-full ${selectedOperators.includes(operator.value) ? 'bg-white' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-white drop-shadow-md">
                          {operator.label}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default SelectOperatorAccordion;