import React from 'react'
import { Button } from '../ui/button'

export const DrawSetallitePolygon = ({ selectedPolygon, handlePolygonChange, setTryOfGeo, tryOfGeo }) => {

    const handlePolygon = () => {
        setTryOfGeo('polygon')
        
    }
    return (
        <div className="flex items-center gap-2 w-full">
           <Button disabled={tryOfGeo === 'full'} onClick={() => handlePolygon()} className='bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full'
           >Draw Polygon</Button>
        </div>
    );
};
