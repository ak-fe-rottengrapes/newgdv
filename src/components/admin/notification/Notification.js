'use client'
import { getNotification } from '@/components/services/admin/notification/api'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { User } from 'lucide-react'

const Notification = () => {
    const { toast } = useToast()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])

    const getNotifications = async () => {
        try {
            setLoading(true)
            const notification = await getNotification(session.user.access);
            setList(notification)
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'subtle',
                status: 'error',
                duration: 2000,
            })
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (session?.user?.access) {
            getNotifications()
        }
    }, [session?.user?.access])
    return (
        <div className='flex flex-col items-center justify-center p-2'>
            <div className='flex justify-between items-center border rounded-md border-gray-500 shadow-lg p-2 w-full bg-[#2b3a4a]'>
                <div></div>
                <div className='text-base font-semibold text-white'>
                    <span>
                        Notification
                    </span>
                </div>
                <div></div>
            </div>
            <div className='flex flex-col overflow-y-auto h-[calc(100vh-143px)] border rounded-md border-gray-500 shadow-lg p-2 w-full mt-2 bg-[#3e4f61]'>
                {list.length ? (
                    list.map((ele) => {
                        return (
                            <div key={ele.id} className="flex justify-between items-center my-2 p-2 bg-[#2b3a4a] rounded-md shadow-md">
                                <div className='flex items-center'>
                                    <User
                                        className="text-3xl text-white rounded-full bg-[#3e4f61] p-1"
                                    />
                                    <p
                                        className="mx-6 text-sm font-medium text-white"
                                    >
                                        {ele.description}
                                    </p>
                                </div>
                                <button
                                    className="p-2 border border-white rounded text-xs font-bold text-white hover:bg-white hover:text-black"
                                    id={ele.order}
                                    onClick={() => {
                                        setOrderId(ele.order)
                                        console.log(orderId)
                                        setDailogBoxName("admin");
                                        setDailogOpen(true);
                                    }}
                                >
                                    Check Request
                                </button>
                            </div>
                        );
                    })
                ) : (
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
                )}
            </div>
        </div>
    )
}

export default Notification