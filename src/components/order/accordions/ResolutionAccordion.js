'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const resolutionTypes = [
  {
    id: 'superHigh',
    label: 'Super high',
    value: 'super_high',
    imagePath: '/assets/superHigh.png',
    resolution: '15-30cm'
  },
  {
    id: 'veryHigh',
    label: 'Very high',
    value: 'very_high',
    imagePath: '/assets/veryHigh.png',
    resolution: '50cm'
  },
  {
    id: 'high',
    label: 'High',
    value: 'high',
    imagePath: '/assets/high.png',
    resolution: '80cm-1m'
  },
  {
    id: 'medium',
    label: 'Medium',
    value: 'medium',
    imagePath: '/assets/medium.png',
    resolution: '3m-5m'
  }
];

const resolutionMarkers = [
  { value: -1, label: '15cm' },
  { value: 0, label: '30cm' },
  { value: 1, label: '50cm' },
  { value: 2, label: '80cm' },
  { value: 3, label: '1m' },
  { value: 4, label: '3m' },
  { value: 5, label: '5m' }
];

export const ResolutionAccordion = ({ isDisabled = false, onResolutionChange }) => {
  const [sliderValue, setSliderValue] = useState(-1);
  const [selectedResolution, setSelectedResolution] = useState('super_high');
  const [tooltipValue, setTooltipValue] = useState('15 cm');

  const handleSliderChange = (value) => {
    setSliderValue(value);
    updateResolutionFromSlider(value);
  };

  const updateResolutionFromSlider = (value) => {
    let newResolution;
    let newTooltipValue;

    switch (value) {
      case -1:
      case 0:
        newResolution = 'super_high';
        newTooltipValue = value === -1 ? '15 cm' : '30 cm';
        break;
      case 1:
        newResolution = 'very_high';
        newTooltipValue = '50 cm';
        break;
      case 2:
      case 3:
        newResolution = 'high';
        newTooltipValue = value === 2 ? '80 cm' : '1 m';
        break;
      case 4:
      case 5:
        newResolution = 'medium';
        newTooltipValue = value === 4 ? '3 m' : '5 m';
        break;
    }

    setSelectedResolution(newResolution);
    setTooltipValue(newTooltipValue);
    onResolutionChange?.({ resolution: newResolution, value: newTooltipValue });
  };

  const handleResolutionSelect = (value, defaultSliderValue) => {
    setSelectedResolution(value);
    setSliderValue(defaultSliderValue);
    onResolutionChange?.({ resolution: value, value: resolutionMarkers[defaultSliderValue + 1].label });
  };

  return (
    <TooltipProvider>
      <Accordion 
        type="single" 
        collapsible 
        className="rounded-lg bg-[#2b3a4a] hover:bg-[#192028] transition-colors duration-200 text-white"
      >
        <AccordionItem 
          value="resolution" 
          className="border-none data-[state=open]:bg-[#192028]"
          disabled={isDisabled}
        >
          <AccordionTrigger className="text-sm font-bold px-4 py-3">
            <div className="flex items-center gap-2">
              Resolution
              <Tooltip>
             
                <TooltipContent>
                  Select the resolution level for your imagery
                </TooltipContent>
              </Tooltip>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {resolutionTypes.map((type) => (
                <div key={type.id} className="relative">
                  <label 
                    className="block cursor-pointer group"
                    htmlFor={type.id}
                  >
                    <input
                      type="radio"
                      id={type.id}
                      value={type.value}
                      name="resolution"
                      checked={selectedResolution === type.value}
                      onChange={() => handleResolutionSelect(type.value, type.value === 'super_high' ? -1 : type.value === 'very_high' ? 1 : type.value === 'high' ? 3 : 5)}
                      className="hidden peer"
                    />
                    <div className="relative overflow-hidden rounded-lg border-2 border-transparent transition-all duration-200 peer-checked:border-blue-500 peer-checked:shadow-lg">
                      <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 peer-checked:opacity-0"></div>
                      <Image 
                        src={type.imagePath} 
                        width={200} 
                        height={150} 
                        alt={`${type.label} resolution`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute bottom-2 left-2 flex items-center gap-2">
                        <span className={`h-4 w-4 rounded-full border-2 border-white transition-colors duration-200 ${selectedResolution === type.value ? 'bg-white' : 'bg-transparent'}`}></span>
                        <span className="text-sm font-medium text-white drop-shadow-md">
                          {type.label}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="relative pt-6 px-2">
              <Slider
                value={[sliderValue]}
                min={-1}
                max={5}
                step={1}
                onValueChange={(value) => handleSliderChange(value[0])}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-300">
                {resolutionMarkers.map((marker) => (
                  <span 
                    key={marker.value}
                    className="cursor-pointer hover:text-white transition-colors duration-200"
                    onClick={() => handleSliderChange(marker.value)}
                  >
                    {marker.label}
                  </span>
                ))}
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                {tooltipValue}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TooltipProvider>
  );
};

export default ResolutionAccordion;