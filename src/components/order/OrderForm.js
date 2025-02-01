"use client"
import React from 'react'
import { useState, useContext, useCallback } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ToolProvider } from '@/app/context/ToolContext';
import FileUploader from './FileUploader';
import DrawPolygon from './DrawPolygon';
import Rectangle from './Rectangle';
import { DateAccordion } from './accordions/DateAccordion';
import { CloudCoverAccordion } from './accordions/CloudCoverAccordion';
import { ResolutionAccordion } from './accordions/ResolutionAccordion';
import { TypeOfImagery } from './accordions/TypeOfImagery';
import { SelectOperatorAccordion } from './accordions/SelectOperatorAccordion';
import { ONA } from './accordions/ONA';
import { AdditionalAccordion } from './accordions/AdditionalAccordion';
import { MapContext } from '@/app/context/MapContext';
import { fromLonLat } from 'ol/proj';

const OrderForm = () => {
    const [selectedButton, setSelectedButton] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { map, setMap, baseMap, selectedMap, handleMapChange } = useContext(MapContext);

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.length > 1) {
                fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
                    .then((response) => response.json())
                    .then((data) => setSearchResults(data));
            } else {
                setSearchResults([]);
            }
        }, 300),
        []
    );

    const handleSearch = (e) => {
        const locationQuery = e.target.value;
        setSearchTerm(locationQuery);
        debouncedSearch(locationQuery);
    };

    const handleLocationSelect = (location) => {
        console.log(location);
        const coordinates = fromLonLat([parseFloat(location.lon), parseFloat(location.lat)]);
        map.getView().animate({
            zoom: 11,
            center: coordinates,
            duration: 2000,
        });
        setSearchResults([]);
        setSearchTerm("");
    };

    // Debounce utility function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    return (
        <ToolProvider>
            <div className='flex flex-col'>
                <div className='flex flex-col gap-6'>
                    <div className='w-full bg-[#2b3a4a] text-center rounded-md p-2'>
                        <h1>Order Imagery</h1>
                    </div>
                    <div className='w-full rounded-md flex'>
                        <Button
                            variant="outline"
                            className={`rounded-r-none border-r-0 flex-1 bg-[#2b3a4a] hover:bg-[#212B35] hover:text-white ${selectedButton === "archive" ? "bg-[#212B35] text-white" : ""}`}
                            onClick={() => setSelectedButton("archive")}
                        >
                            Archive Imagery
                        </Button>
                        <Button
                            variant="outline"
                            className={`rounded-l-none flex-1 bg-[#2b3a4a] hover:bg-[#212B35] hover:text-white ${selectedButton === "new" ? "bg-[#212B35] text-white" : ""}`}
                            onClick={() => setSelectedButton("new")}
                        >
                            New tasking
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                            placeholder='Search' 
                            className="pl-10" 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute w-full bg-[#2b3a4a] mt-1 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto ">
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 hover:bg-[#212B35] cursor-pointer"
                                        onClick={() => handleLocationSelect(result)}
                                    >
                                        {result.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='flex justify-between'>
                        <FileUploader />
                        <DrawPolygon />
                        <Rectangle />
                    </div>
                    <div className="space-y-2 overflow-y-auto h-[calc(100vh-350px)] flex flex-col gap-2">
                        <DateAccordion />
                        <TypeOfImagery />
                        <ResolutionAccordion />
                        <SelectOperatorAccordion />
                        <CloudCoverAccordion />
                        <ONA />
                        <AdditionalAccordion />
                    </div>
                    <div className='flex justify-between  w-full gap-2'>
                        <Button className='w-full bg-[#2b3a4a] hover:bg-[#192028] text-white'>Cancel</Button>
                        <Button className='w-full bg-[#2b3a4a] hover:bg-[#192028] text-white'>Submit</Button>
                    </div>
                </div>
            </div>
        </ToolProvider>
    )
}

export default OrderForm