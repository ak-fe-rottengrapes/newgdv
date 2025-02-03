'use client'
import React, { useState, useEffect } from "react";
import { BadgeCheck, BookX, Clock } from "lucide-react";
import { CiCircleInfo } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { FaMapMarked } from "react-icons/fa";
import { MdHd } from "react-icons/md";
import { WiDayCloudy } from "react-icons/wi";
import { getOrders, deleteOrder } from "../services/orderList/api";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const dummyOrders = [
    {
        id: 1,
        name: "Order 1",
        area: 5000000,
        operators: "Operator A",
        resolution: "High",
        imagery_type: "Satellite",
        order_status: "approved",
        created_at: "2023-10-01T10:00:00Z",
    },
    {
        id: 2,
        name: "Order 2",
        area: 3000000,
        operators: "Operator B",
        resolution: "Medium",
        imagery_type: "Drone",
        order_status: "pending",
        created_at: "2023-10-02T11:00:00Z",
    },
    {
        id: 3,
        name: "Order 3",
        area: 1000000,
        operators: "Operator C",
        resolution: "Low",
        imagery_type: "Aerial",
        order_status: "cancelled",
        created_at: "2023-10-03T12:00:00Z",
    },
];

const Orderlist = () => {
    const {toast} = useToast();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(null);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDelete, setIsDelete] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getOrders(session?.user?.access);
                setOrderList(response); // Update to handle the new data structure
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: "destructive",
                    status: 'error',
                    duration: 2000,
                })
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [session?.user?.access])


    const onEditClick = (id) => {
        // Handle edit click
    };

    const handleDeletePopup = (id) => {
        setOpen(true);
        setDeleteId(id);
    };

    const handleDelete = async() => {
        try {
            setIsDelete(true);
            await deleteOrder(session?.user?.access, deleteId);
            setOrderList((prevList) => prevList.filter((order) => order.id !== deleteId));
            toast({
                title: 'Success',
                description: 'Order deleted successfully',
                className: 'bg-green-100',
                status: 'success',
                duration: 2000,
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: "destructive",
                status: 'error',
                duration: 2000,
            })
        } finally {
            setIsDelete(false);
            setOpen(false);
        }
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    return (
        <div className={`h-full overflow-y-scroll rounded-lg backdrop-blur-sm font-inter`} >
            <h1 className={`text-lg p-1 border text-center font-bold bg-[#202A33] rounded-lg`} style={{ color: "rgba(255, 255, 255, 1)" }}>
                My Orders
            </h1>


            {loading ? (
                <div className="border rounded-lg mt-4 p-2 h-[calc(100vh-100px)] overflow-y-auto">
                
                  {/* Repeat this skeleton block multiple times for loading effect */}
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="border shadow-lg rounded my-2 p-2 w-full relative animate-pulse">
                      <div className="flex">
                        {/* Icon Skeleton */}
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        
                        <div className="ml-1 mt-3 w-full">
                          {/* Title Skeleton */}
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          
                          <div className="text-xs font-normal w-44">
                            {/* Multiple Info Rows */}
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="mx-2 my-2 w-full flex justify-between">
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-4 w-4 bg-gray-200 rounded-full" />
                              </div>
                            ))}
                            
                            {/* Status Row */}
                            <div className="mx-2 my-2 w-full flex justify-between">
                              <div className="h-3 bg-gray-200 rounded w-1/3" />
                              <div className="h-4 w-4 bg-gray-200 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
              
                      {/* Date Skeleton */}
                      <div className="absolute right-0 top-0 p-1 m-1">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
              
                      {/* Action Buttons Skeleton */}
                      <div className="absolute right-2 top-12 space-y-3">
                        <div className="h-7 w-7 bg-gray-200 rounded-full" />
                        <div className="h-7 w-7 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
            ) : (

                <div className="border rounded-lg mt-4 p-2 h-[calc(100vh-100px)] overflow-y-auto">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="bg-[#202A33] text-white p-6 rounded-lg shadow-lg">
                            <DialogHeader className="space-y-3">
                                <DialogTitle className="text-lg font-semibold text-white">
                                    Are you absolutely sure?
                                </DialogTitle>
                                <DialogDescription className="text-gray-300 text-sm">
                                    Once you delete this order, it cannot be recovered.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-3 mt-4">
                                <Button
                                    className="border border-gray-500 text-gray-300 hover:bg-gray-700"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={handleDelete}
                                >
                                    {isDelete ? 'Deleting...' : 'Delete'}   
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>


                    {orderList.map((ele) => (
                        <div key={ele.id} className={`border shadow-lg rounded my-2 p-2 w-full relative ${ele.order_status === "approved" ? "border-green-500" : ele.order_status === "pending" ? "border-yellow-500" : "border-red-500"}`}>
                            <div className="flex">
                                <div>
                                    {ele.order_status === "approved" ? (
                                        <BadgeCheck className="text-green-500" size={32} />
                                    ) : ele.order_status === "pending" ? (
                                        <Clock className="text-yellow-500" size={32} />
                                    ) : (
                                        <BookX className="text-red-500" size={32} />
                                    )}
                                </div>
                                <div className="ml-1 mt-3">
                                    <h1 style={{ color: "white" }} className="text-base font-semibold mx-2 my-1 text-wrap">{ele.name}</h1>
                                    <div className="flex text-xs font-normal w-44" style={{ color: "white" }}>
                                        <div className="mx-2 w-full">
                                            {/* <p>{ele.id}</p> */}
                                            <p className="my-2 w-full flex justify-between items-center">{`${ele.area} km²`}<GiPathDistance className="text-lg" /></p>
                                            <p className="my-2 w-full flex justify-between items-center">{"Ticket Location "} <FaMapMarked className="text-lg" /></p>
                                            <p className="my-2 w-full flex justify-between items-center">{ele.resolution} <MdHd className="text-lg" /></p>
                                            <p className="my-2 w-full flex justify-between items-center">{ele.imagery_type} <WiDayCloudy className="text-lg" /></p>
                                            <p className="my-2 w-full flex justify-between items-center">{ele.order_status}
                                                {ele.order_status === "approved" ? (
                                                    <BadgeCheck className="text-green-500" size={16} />
                                                ) : ele.order_status === "pending" ? (
                                                    <Clock className="text-yellow-500" size={16} />
                                                ) : (
                                                    <BookX className="text-red-500" size={16} />
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs font-normal absolute right-0 top-0 p-1 m-1" style={{ color: "white" }}>{`Order Date: ${formatDateTime(ele.created_at)}`}</p>
                            <div className="absolute right-2 top-12">
                                <button className="h-7 w-7 rounded flex justify-center items-center" style={{ border: "1px solid rgba(106, 106, 106, 1)", }} onClick={() => onEditClick(ele.id)}>
                                    <CiCircleInfo style={{ color: 'white' }} />
                                </button>
                                <button className="h-7 w-7 rounded flex justify-center items-center mt-3" style={{ border: "1px solid rgba(106, 106, 106, 1)" }}>
                                    <MdDeleteForever style={{ color: 'white' }} onClick={() => handleDeletePopup(ele.id)} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orderlist;