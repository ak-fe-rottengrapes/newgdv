'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getOrders } from '../services/orderList/api';
import { LuCalendarRange } from "react-icons/lu";
import cancelled_lg from "./images/cancelled-lg.svg";
import approved_lg from "./images/approved-lg.svg";
import pending_lg from "./images/pending-lg.svg";
import cancelled_sm from "./images/cancelled.svg";
import approved_sm from "./images/approved.svg";
import pending_sm from "./images/pending.svg";
import setalite from "./images/setalite.svg";
import daytime from "./images/daytime.svg";
import nightTime from "./images/nightTime.svg";
import HD from "./images/HD.svg";
import distance from "./images/distance.svg";
import location from "./images/location.svg";
import Image from 'next/image';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from "react-date-range";
import Loader from './Loaders/Loader';
import RequestDialog from './dialogs/RequestDialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Orders() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    let [filteredList, setFilteredList] = useState([]);
    const [rangeOpen, setRangeOpen] = useState(false);
    const [toOpen, setToOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {

        }
    ]);
    const router = useRouter()
    const pathName = usePathname()
    const [show, setShow] = useState(false)
    const searchParam = useSearchParams()
    const orderId = searchParam.get('orderId')
    useState(() => {

        if (orderId)
            setShow(true)
        else setShow(false)
    }, [orderId])
    const handleAllOrders = () => {
        setFilteredList(list)
    }

    const fetchOrderList = async () => {
        setLoading(true);
        if (session?.user?.access) {
            try {
                const data = await getOrders(session.user.access);
                console.log(data)
                setList(data);
                setFilteredList(data)
                console.log(data)
            } catch (error) {
                console.error("Failed to fetch order list:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }
    };
    const toggleDateRange = () => {
        setRangeOpen((prev) => !prev);
    };
    useEffect(() => {
        console.log(session?.user)
        if (session?.user?.access) {
            fetchOrderList();
        }
    }, [session?.user?.access]);

    return (
        <div
            className=" p-2 rounded-lg h-[calc(100vh-64px)]"

        >
            <div

                className="w-full text-white border border-gray-500 rounded relative flex justify-center items-center p-2 text-base font-bold"
            >
                <h1>Orders</h1>

                {/* <RiFilter2Fill
        className="absolute right-2 text-2xl border border-transparent rounded-md hover:border-white"
        onClick={filterOpenCloseHandler}
      /> */}
                {/* <BsFillArrowLeftCircleFill
        className="text-white text-2xl absolute left-2"
        onClick={() => setPageNo(0)}
      /> */}
                <div className="text-xl absolute right-2 flex ">

                    {/* <button
                        className="mr-2 text-white"
                        onClick={toggleDateRange}
                    >
                        <LuCalendarRange />
                    </button> */}
                    <button
                        className="text-sm"
                        onClick={handleAllOrders}
                    >
                        All orders
                    </button>
                </div>
            </div>

            <div className="rounded border h-[calc(100vh-130px)]  border-gray-500 px-2 relative mt-2 overflow-y-scroll">
                {rangeOpen && (
                    <div className="fixed top-15 right-5 ">
                        <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setDateRange([item.selection])}
                            ranges={dateRange}
                            months={2}
                            direction="horizontal"
                            className="w-[450px] shadow-xl rounded-md z-20"
                        />
                    </div>
                )}

                {loading ? <Loader /> :
                    filteredList.map((ele) => {
                        return (
                            <div
                                className="flex shadow-md border border-gray-500  flex-col bg-transparent lg:flex-row justify-between w-full py-2 px-3 rounded-md text-white  my-2 "
                                key={ele.id}
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
                                        <p className="text-xs mt-3">{ele.id}</p>
                                    </div>
                                </div>
                                {/* Order Details (w-3/5)*/}
                                <div className="flex flex-wrap text-white w-full my-2 lg:my-0 lg:w-2/4 justify-between">
                                    <div className="inline-block w-1/4">
                                        <p className="flex justify-between w-full text-xs mt-1 ">
                                            {ele.operators} <Image src={setalite} alt="setalite" />
                                        </p>
                                        <p className="flex justify-between w-full text-xs mt-3">
                                            {ele.resolution} <Image src={HD} alt="resolution" />
                                        </p>
                                    </div>
                                    <div className="inline-block w-1/4">
                                        <p className="flex justify-between w-full text-xs mt-1">
                                            {`${(ele.area / 1000000).toFixed(2)} km²`} <Image src={distance} alt="area" />
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

                                <div className="text-white">
                                    <p
                                        className=" text-xs font-normal mt-1 "
                                    >
                                        {`Order Date: ${new Date(ele.created_at).toLocaleDateString()}`}
                                    </p>
                                    <div className="w-fill flex justify-center items-center mt-3">
                                        <RequestDialog show={show} setShow={setShow} orderId={orderId}>
                                            <button
                                                className="p-2 border border-white rounded text-xs font-bold hover:bg-black hover:text-white "
                                                id={ele.id}
                                                onClick={() => router.push('/employee?orderId=' + ele.id)}
                                            >
                                                check request
                                            </button>
                                        </RequestDialog>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

        </div>
    )
}

export default Orders