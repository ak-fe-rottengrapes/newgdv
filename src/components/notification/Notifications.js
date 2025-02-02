import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsChevronLeft } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
// import { Spinner } from "@chakra-ui/react";
import approved from "../../../public/assets/notification/approved.svg";
import canceled from "../../../public/assets/notification/cancelled.svg";
import pending from "../../../public/assets/notification/pending.svg";
import { getNotification } from "../services/notification/api";
import { useSession } from "next-auth/react";
import { BadgeCheck, BookX, Clock } from "lucide-react";

const dummyNotifications = [
    {
        id: 1,
        title: "Order Canccelled",
        order: "Order #12345",
        area: 5000000,
        operators: "Operator A",
        resolution: "High",
        imagery_type: "Satellite",
        order_status: "cancelled",
    },
    {
        id: 4,
        title: "Order Pending",
        order: "Order #12345",
        area: 5000000,
        operators: "Operator A",
        resolution: "High",
        imagery_type: "Satellite",
        order_status: "pending",
    },
    {
        id: 5,
        title: "Order Approved",
        order: "Order #12345",
        area: 5000000,
        operators: "Operator A",
        resolution: "High",
        imagery_type: "Satellite",
        order_status: "approved",
    },
    {
        id: 2,
        title: "Order Pending",
        order: "Order #12346",
        area: 3000000,
        operators: "Operator B",
        resolution: "Medium",
        imagery_type: "Drone",
        order_status: "pending",
    },
    {
        id: 3,
        title: "Order Cancelled",
        order: "Order #12347",
        area: 1000000,
        operators: "Operator C",
        resolution: "Low",
        imagery_type: "Aerial",
        order_status: "cancelled",
    },
];

const Notifications = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [notificationList, setNotificationList] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await getNotification(session?.user?.access);
                // setNotificationList(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchNotifications();
    },[session?.user?.access])

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setNotificationList(dummyNotifications);
            setLoading(false);
        }, 1000);
    }, [reload]);

    const fetchNotifications = () => {
        setReload(true);
    };

    return (
        <>

            <h1
                className={`text-lg p-1 m-1 text-center font-bold border rounded-lg bg-[#202A33]`}
                style={{ color: "rgba(255, 255, 255, 1)" }}
            >
                My Notifications
            </h1>
            {/* <div
        className="h-[1px] mt-3 mb-2"
        style={{ background: "rgba(95, 95, 95, 0.5)" }}
      ></div> */}

            {loading ? (
                <div className="border rounded-lg p-2 m-1 mt-4 h-[calc(100vh-100px)] overflow-y-auto">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="border shadow-lg rounded my-2 p-2 w-full animate-pulse">
                    <div className="flex">
                      {/* Icon Skeleton */}
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      
                      <div className="ml-1 w-full">
                        {/* Title Skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-2" />
                        
                        <div className="flex text-xs font-normal">
                          {/* Left Column */}
                          <div className="mx-2 w-1/2">
                            <div className="h-3 bg-gray-200 rounded w-3/4 my-2" />
                            <div className="h-3 bg-gray-200 rounded w-full my-2" />
                            <div className="h-3 bg-gray-200 rounded w-2/3 my-2" />
                          </div>
                          
                          {/* Right Column */}
                          <div className="mx-2 ml-12 w-1/2">
                            <div className="h-3 bg-gray-200 rounded w-full my-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4 my-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Message Skeleton */}
                    <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto my-2" />
                  </div>
                ))}
              </div>
            ) : notificationList.length === 0 ? (
                <div className="flex justify-center items-center h-96">
                    <p className="text-white">No notifications</p>
                </div>
            ) : (
                <div className="border rounded-lg p-2 m-1 mt-4 h-[calc(100vh-100px)] overflow-y-auto">
                    {notificationList.map((ele) => (
                        <div
                            key={ele.id}
                            className={`bg-[#202A33] border shadow-lg rounded my-2 p-2 w-full ${ele.order_status === "approved" ? "border-green-500" : ele.order_status === "pending" ? "border-yellow-500" : "border-red-500"}`}
                        >
                            <div className="flex">
                                <div>
                                    {/* <Image
                                        src={
                                            ele.order_status === "approved"
                                                ? approved
                                                : ele.order_status === "pending"
                                                    ? pending
                                                    : canceled
                                        }
                                        alt="Order status icons"
                                    /> */}
                                    {ele.order_status === "approved" ? (
                                        <BadgeCheck  className="text-green-500" size={32} />
                                    ) : ele.order_status === "pending" ? (
                                        <Clock  className="text-yellow-500" size={32} />
                                    ) : (
                                        <BookX className="text-red-500" size={32} />
                                    )}
                                </div>
                                <div className="ml-1">
                                    <h1
                                        style={{ color: "white" }}
                                        className="text-sm font-semibold mx-2 my-1"
                                    >
                                        {ele.title}
                                    </h1>
                                    <div
                                        className="flex text-xs font-normal"
                                        style={{ color: "white" }}
                                    >
                                        <div className="mx-2">
                                            <p>{ele.order}</p>
                                            <p className="my-2">
                                                {`${(ele.area / 1000000).toFixed(2)} km²`}
                                            </p>
                                            <p>{`Operator: ${ele.operators}`}</p>
                                        </div>
                                        <div className="mx-2 ml-12">
                                            <h1></h1>
                                            <p className="my-2">Resolution: {ele.resolution}</p>
                                            <p>Imagery Type: {ele.imagery_type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p
                                className=" text-xs font-normal text-center w-full my-2"
                                style={{ color: "white" }}
                            >
                                {ele.order_status === "approved"
                                    ? "Congratulations! Your request is approved"
                                    : ele.order_status === "pending"
                                        ? "Your request has been sent to the admin please wait..."
                                        : "Your request has been cancelled"}
                            </p>
                        </div>
                    ))}

                </div>
            )}
        </>
    );
};

export default Notifications;