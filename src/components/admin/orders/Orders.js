'use client'
import { getOrders } from '@/components/services/admin/orders/api';
import { Button } from '@/components/ui/button'
import { Delete, Filter, Trash2, Check, ChevronsUpDown } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { PulseLoader } from 'react-spinners';
import cancelled_lg from '../../../../public/assets/admin/images/cancelled-lg.svg';
import approved_lg from '../../../../public/assets/admin/images/approved-lg.svg';
import pending_lg from '../../../../public/assets/admin/images/pending-lg.svg';
import cancelled_sm from '../../../../public/assets/admin/images/cancelled.svg';
import approved_sm from '../../../../public/assets/admin/images/approved.svg';
import pending_sm from '../../../../public/assets/admin/images/pending.svg';
import setalite from '../../../../public/assets/admin/images/setalite.svg';
import daytime from '../../../../public/assets/admin/images/daytime.svg';
import nightTime from '../../../../public/assets/admin/images/nightTime.svg';
import HD from '../../../../public/assets/admin/images/HD.svg';
import distance from '../../../../public/assets/admin/images/distance.svg';
import Image from 'next/image';
import location from '../../../../public/assets/admin/images/location.svg';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import RequestDialog from './RequestDialog';
import { useAdmin } from '@/app/context/AdminContext';

const Orders = () => {
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [filter, setFilter] = useState("All");

    const {
        orderId,
    setOrderId,
    } = useAdmin();
    
    const fetchOrderList = async (accessToken) => {
        setLoading(true);
        try {
            const data = await getOrders(accessToken);
            setList(data);
            setFilteredList(data);
        } catch (error) {
            console.error("Failed to fetch order list:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.access) {
            fetchOrderList(session?.user?.access);
        }
    }, [session?.user?.access]);

    useEffect(() => {
        if (filter === "All") {
            setFilteredList(list);
        } else {
            setFilteredList(list.filter(order => order.order_status === filter.toLowerCase()));
        }
    }, [filter, list]);

    const ComboboxDemo = () => {
        const [open, setOpen] = useState(false);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[110px] text-white hover:text-white hover:bg-[#303d4b] bg-[#3e4f61] justify-between">
                        {filter}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 ">
                    <Command className='bg-[#3e4f61] text-white'>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No status found.</CommandEmpty>
                            <CommandGroup className='text-white'>
                                {["All", "Approved", "Pending", "Cancelled"].map(status => (
                                    <CommandItem
                                        key={status}
                                        value={status}
                                        onSelect={() => {
                                            setFilter(status);
                                            setOpen(false);
                                        }}
                                    >
                                        {status}
                                        <Check className={cn("ml-auto", filter === status ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <div className='flex flex-col items-center justify-center p-2'>
            <div className='flex justify-between items-center border rounded-md border-gray-500 shadow-lg p-2 w-full'>
                <div><ComboboxDemo /></div>
                <div className='text-base font-semibold text-white'>
                    <span>
                        Orders
                    </span>
                </div>
                <div className='flex gap-2 items-center'>
                    <Trash2 size={16} color='#ffffff' />
                </div>
            </div>
            <div className='flex flex-col overflow-y-auto h-[calc(100vh-130px)] border rounded-md border-gray-500 shadow-lg p-2 w-full mt-2'>
                {loading ? (
                    <div className="flex flex-col w-full h-full">
                        {/* Repeat the skeleton loader for each item in the list */}
                        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col lg:flex-row shadow-lg justify-between w-full border border-gray-500 text-white my-2 p-1 rounded animate-pulse"
                            >
                                {/* Image and Name Skeleton */}
                                <div className="flex">
                                    <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                                    <div className="ml-3">
                                        <div className="w-24 h-4 bg-gray-500 rounded"></div>
                                        <div className="w-16 h-3 bg-gray-500 rounded mt-2"></div>
                                    </div>
                                </div>

                                {/* Order Details Skeleton */}
                                <div className="flex flex-wrap text-white w-full my-2 lg:my-0 lg:w-2/4 justify-between">
                                    <div className="inline-block w-1/4">
                                        <div className="w-16 h-3 bg-gray-500 rounded"></div>
                                        <div className="w-12 h-3 bg-gray-500 rounded mt-2"></div>
                                    </div>
                                    <div className="inline-block w-1/4">
                                        <div className="w-16 h-3 bg-gray-500 rounded"></div>
                                        <div className="w-12 h-3 bg-gray-500 rounded mt-2"></div>
                                    </div>
                                    <div className="inline-block w-1/4">
                                        <div className="w-16 h-3 bg-gray-500 rounded"></div>
                                        <div className="w-12 h-3 bg-gray-500 rounded mt-2"></div>
                                    </div>
                                </div>

                                {/* Order Date and Button Skeleton */}
                                <div className="text-white">
                                    <div className="w-24 h-3 bg-gray-500 rounded"></div>
                                    <div className="w-20 h-8 bg-gray-500 rounded mt-3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredList.length === 0 ? (
                            <div className="flex text-white justify-center items-center w-full h-full text-lg">
                                No data available
                            </div>
                        ) : (
                            filteredList.map((ele) => {
                                return (
                                    <div
                                        key={ele.id}
                                        className="flex flex-col lg:flex-row shadow-lg justify-between w-full border border-gray-500 text-white my-2 p-1 rounded"
                                    >
                                        <div className="flex">
                                            <Image
                                                alt="status"
                                                src={
                                                    ele.order_status === "approved"
                                                        ? approved_lg
                                                        : ele.order_status === "pending"
                                                            ? pending_lg
                                                            : cancelled_lg
                                                }
                                            />
                                            <div className="ml-3 ">
                                                <h1 className="text-base font-medium">{ele.name}</h1>
                                                {/* <p className="text-xs mt-3">{ele.id}</p> */}
                                            </div>
                                        </div>
                                        {/* Order Details (w-3/5)*/}
                                        <div className="flex flex-wrap text-white w-full my-2 lg:my-0 lg:w-2/4 justify-between">
                                            <div className="inline-block w-1/4">
                                                <p className="flex justify-between w-full text-xs mt-1 ">
                                                    {ele.operators.join(',')} <Image src={setalite} alt="setalite" />
                                                </p>
                                                <p className="flex justify-between w-full text-xs mt-3">
                                                    {ele.resolution} <Image src={HD} alt="resolution" />
                                                </p>
                                            </div>
                                            <div className="inline-block w-1/4">
                                                <p className="flex justify-between w-full text-xs mt-1">
                                                    {`${(ele.area)} km²`} <Image src={distance} alt="area" />
                                                </p>
                                                <p className="flex justify-between w-full text-xs mt-3">
                                                    {"Location"} <Image src={location} alt="location" />
                                                </p>
                                            </div>
                                            <div className="inline-block w-1/4">
                                                <p className="flex justify-between text-xs mt-1">
                                                    {ele.imagery_type}{" "}
                                                    <Image
                                                        src={
                                                            ele.imagery_type === "Daytime" ? daytime : nightTime
                                                        }
                                                        alt="Status of day"
                                                    />
                                                </p>
                                                <p className="flex justify-between w-full text-xs mt-3">
                                                    {ele.order_status}{" "}
                                                    <Image
                                                        src={
                                                            ele.order_status === "approved"
                                                                ? approved_sm
                                                                : ele.order_status === "pending"
                                                                    ? pending_sm
                                                                    : cancelled_sm
                                                        }
                                                        alt="status"
                                                    />
                                                </p>
                                            </div>
                                        </div>

                                        <div key={ele.id} className="text-white">
                                            <p
                                                className=" text-xs font-normal mt-1 "
                                            >
                                                {`Order Date: ${new Date(ele.created_at).toLocaleDateString()}`}
                                            </p>
                                            <div className="w-fill flex justify-center items-center mt-3">
                                                <RequestDialog>
                                                <Button
                                                    className="p-2 bg-[#2b3a4a] border  rounded text-xs font-bold hover:bg-[#384b5f] hover:text-white "
                                                    id={ele.id}
                                                    onClick={() => {
                                                        setOrderId(ele.id)
                                                        // console.log(orderId)
                                                        // setDailogBoxName("admin");
                                                        // setDailogOpen(true);
                                                    }}
                                                >
                                                    check request
                                                </Button>
                                                </RequestDialog>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Orders