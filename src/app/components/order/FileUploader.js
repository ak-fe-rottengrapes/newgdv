'use client';
import { Button } from '@/components/ui/button'
import { FileUp } from 'lucide-react';
import { useTool } from '@/app/context/ToolContext';

const FileUploader = () => {
    const { activeTool, setActiveTool } = useTool();
    const isActive = activeTool === 'fileUpload';

    return (
        <div>
            <Button 
                className={`bg-[#2b3a4a] hover:bg-[#192028] hover:text-white
                    ${isActive ? 'bg-[#192028] text-white' : ''}
                    ${activeTool && !isActive ? 'cursor-not-allowed opacity-50' : ''}
                `}
                onClick={() => setActiveTool('fileUpload')}
                disabled={false}
            >
                <FileUp className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
            </Button>
        </div>
    )
}

export default FileUploader