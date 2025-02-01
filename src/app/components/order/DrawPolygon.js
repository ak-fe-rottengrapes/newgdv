'use client';
import { Button } from '@/components/ui/button'
import { PiPolygonDuotone } from "react-icons/pi";
import { useTool } from '@/app/context/ToolContext';

const DrawPolygon = () => {
    const { activeTool, setActiveTool } = useTool();
    const isActive = activeTool === 'polygon';

    return (
        <div>
            <Button 
                className={`bg-[#2b3a4a] hover:bg-[#192028] hover:text-white
                    ${isActive ? 'bg-[#192028] text-white' : ''}
                    ${activeTool && !isActive ? 'cursor-not-allowed opacity-50' : ''}
                `}
                onClick={() => setActiveTool('polygon')}
                disabled={false}
            >
                <PiPolygonDuotone className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
            </Button>
        </div>
    )
}

export default DrawPolygon