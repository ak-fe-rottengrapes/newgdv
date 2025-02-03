'use client';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useTool } from '@/app/context/ToolContext';

const imageryTypes = [
  {
    id: 'daytime',
    label: 'Daytime',
    value: 'Daytime',
    imagePath: '/assets/daytime.png',
    description: 'Standard daytime satellite imagery with natural colors'
  },
  {
    id: 'sar',
    label: 'SAR',
    value: 'SAR',
    imagePath: '/assets/SAR.png',
    description: 'Synthetic Aperture Radar imaging that works in any weather condition'
  },
  {
    id: 'multiSpectral',
    label: 'Multispectral',
    value: 'Multispectral',
    imagePath: '/assets/multispectral.png',
    description: 'Multiple wavelength bands for detailed surface analysis'
  },
  {
    id: 'nightTime',
    label: 'Night-time',
    value: 'Night-time',
    imagePath: '/assets/nighttime.png',
    description: 'Infrared imagery captured during nighttime hours'
  },
  {
    id: 'stereo',
    label: 'Stereo',
    value: 'Stereo',
    imagePath: '/assets/nighttime.png',
    description: '3D imagery for depth perception and terrain analysis'
  },
  {
    id: 'mono',
    label: 'Mono',
    value: 'Mono',
    imagePath: '/assets/nighttime.png',
    description: 'Single band imagery for basic visual analysis'
  },
  {
    id: 'dem',
    label: 'DEM',
    value: 'DEM',
    imagePath: '/assets/nighttime.png',
    description: 'Digital Elevation Model for terrain analysis'
  }
];

export const TypeOfImagery = ({ isDisabled, onTypeChange }) => {
    const { imagery_type, setImageryType, } = useTool();
    const [selectedType, setSelectedType] = useState('');

    const handleChange = (value) => {
        setImageryType(value);
        setSelectedType(value);
        onTypeChange?.(value);
    };

    return (
        <TooltipProvider>
            <Accordion 
                type="single" 
                collapsible 
                className="rounded-lg bg-[#2b3a4a] hover:bg-[#192028] transition-colors duration-200 text-white"
            >
                <AccordionItem 
                    value="producttype" 
                    className="border-none data-[state=open]:bg-[#192028] data-[state=open]:rounded-lg"
                    disabled={isDisabled}
                >
                    <AccordionTrigger className="text-sm font-bold px-4 py-3">
                        <div className="flex items-center gap-2">
                            Type of Imagery
                            <Tooltip>
                                {/* <TooltipTrigger>
                                    <Info className="h-4 w-4 text-slate-400" />
                                </TooltipTrigger> */}
                                <TooltipContent>
                                    Select the type of satellite imagery you want to view
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-4">
                            {imageryTypes.map((type) => (
                                <div key={type.id} className="relative">
                                    <label 
                                        className="block cursor-pointer group"
                                        htmlFor={type.id}
                                    >
                                        <input
                                            type="radio"
                                            id={type.id}
                                            value={type.value}
                                            name="imagery"
                                            checked={selectedType === type.value}
                                            onChange={() => handleChange(type.value)}
                                            className="hidden peer"
                                        />
                                        <div className="relative overflow-hidden rounded-lg border-2 border-transparent transition-all duration-200 peer-checked:border-blue-500 peer-checked:shadow-lg">
                                            <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 peer-checked:opacity-0"></div>
                                            <Image 
                                                src={type.imagePath} 
                                                width={200} 
                                                height={150} 
                                                alt={`${type.label} imagery`}
                                                className="w-full h-24 object-cover"
                                            />
                                            <div className="absolute top-2 left-2 flex items-center gap-2">
                                                <span className={`h-4 w-4 rounded-full border-2 border-white transition-colors duration-200 ${selectedType === type.value ? 'bg-white' : 'bg-transparent'}`}></span>
                                                <span className="text-sm font-medium text-white drop-shadow-md">
                                                    {type.label}
                                                </span>
                                            </div>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger className="w-full">
                                                <p className="mt-1 text-xs text-slate-300 text-left">
                                                    {type.label}
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {type.description}
                                            </TooltipContent>
                                        </Tooltip>
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

export default TypeOfImagery;