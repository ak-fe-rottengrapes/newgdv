import React from 'react'

function NotificationLoader() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex justify-between items-center my-2 p-2 bg-[#2b3a4a] rounded-md shadow-md animate-pulse">
                    <div className='flex items-center'>
                        <div className="text-3xl text-white rounded-full bg-[#3e4f61] p-1 w-10 h-10"></div>
                        <div className="mx-6 w-48 h-4 bg-[#3e4f61] rounded"></div>
                    </div>
                    <div className="p-2 w-24 h-8 bg-[#3e4f61] rounded"></div>
                </div>
            ))}
        </div>
    )
}

export default NotificationLoader