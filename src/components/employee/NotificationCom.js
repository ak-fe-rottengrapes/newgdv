'use client'
import { getNotification } from '@/components/services/notification/api'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { User } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import NotificationLoader from './Loaders/NotificationLoader'
import RequestDialog from './dialogs/RequestDialog'
import { IoEllipseSharp } from 'react-icons/io5'
const NotificationCom = () => {
    const { toast } = useToast()
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [show,setShow] = useState(false)
    const searchParam = useSearchParams()
    const orderId = searchParam.get('orderId')
    useState(()=>{
        if(orderId)
        setShow(true)
        else setShow(false)
    },[orderId])
    const getNotifications = async () => {
        try {
            setLoading(true)
            const notification = await getNotification(session.user.access);
            console.log(notification)
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
            <div className='flex flex-col overflow-y-auto h-[calc(100vh-130px)] border rounded-md border-gray-500 shadow-lg p-2 w-full mt-2 bg-[#3e4f61]'>
                {!loading ? (
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
                                <RequestDialog show={show} setShow={setShow} orderId={orderId}>
                                    <button
                                        className="p-2 border border-white rounded text-xs font-bold text-white hover:bg-white hover:text-black"
                                        id={ele.order}
                                        onClick={() => router.push('/employee/notifications?orderId=' + ele.order)}

                                    >
                                        Check Request
                                    </button>
                                </RequestDialog>
                            </div>
                        );
                    })
                ) : (
                    <NotificationLoader />
                )}
            </div>
        </div>
    )
}

export default NotificationCom