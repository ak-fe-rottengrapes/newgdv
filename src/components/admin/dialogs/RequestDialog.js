import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import MapComponent from "./map"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useEmployeeContext } from "@/providers/EmployeeProvider"
import { useToast } from "@/hooks/use-toast"
import { getOrderDetails, addImageryLink } from "@/components/services/order/api"
import { TiTick } from "react-icons/ti";
import { CommentDialog } from "./CommentDialog"
import { OperatorsDialog } from "./OperatorsDialog"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useAdmin } from "@/app/context/AdminContext"
import { getEmployeeList } from "@/components/services/admin/employeeList/api"
import { EmployeeCombobox } from "./SelectEmp"
import { Check, Trash2 } from "lucide-react"
import { assignEmployee } from "@/components/services/admin/orders/api"
import { RejectDialog } from "./SelectEmp"

export default function RequestDialog({ children, show, setShow }) {
  const { data: session } = useSession()
  const { setOrderId,
    geoJson,
    setGeoJson,
    map,
    setMap } = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  let [orderData, setOrderData] = useState({});

  let [orderProp, setOrderProp] = useState({});
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [operatorData, setOperatorData] = useState([])
  const [comments, setComments] = useState([])
  const [tableData, setTableData] = useState([]);
  const searchParam = useSearchParams()

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const orderId = searchParam.get("orderId")
  const router = useRouter()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleAddLink = async (e) => {
    setLoading(true)
    e.preventDefault()
    const data = {
      imagery_url: link
    }
    try {
      const response = await addImageryLink(session.user.access, orderId, data);
      toast({
        title: "Success",
        description: response.message,
        variant: "success",
        className: "bg-green-200",
        duration: 2000
      })

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000
      })
    } finally {
      setLoading(false);
    }
  }
  const handleOpenChange = (open) => {
    if (!open) {
      const newParams = new URLSearchParams(searchParam);
      newParams.delete("orderId");
      router.replace(`?${newParams.toString()}`);
      setSelectedEmployeeId(null);
    }
  };

  useEffect(() => {
    if (operatorData && operatorData.JILIN) {
      const formattedData = operatorData.JILIN.map(item => ({
        id: item.id,
        satelliteId: item.satelliteId,
        productId: item.productId,
        imageGeo: item.imageGeo,
      }))
      setTableData(formattedData)
    }
  }, [operatorData]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const [empList, setEmpList] = useState([])
  const fetchOrderDetailes = async () => {
    setIsLoading(true);
    if (session?.user?.access && orderId) {
      try {
        const response = await getOrderDetails(session.user.access, orderId);
        const emp = await getEmployeeList(session.user.access);
        setEmpList(emp)
        setComments(response.comments)
        const orderDetails = response.order.properties;
        setOrderProp(orderDetails);
        setOrderData(response);
        setOperatorData(response.order?.properties?.satellite_data)
        if (response.order?.properties.employee) {
          setSelectedEmployeeId(response.order.properties.employee);
        }
        const geometry = response.order?.geometry;

        let features = [];

        if (geometry) {
          features.push({
            type: "Feature",
            geometry: geometry,
            properties: {
              ...response.order?.properties,
              borderColor: "#FF0000"
            },
          });
        }



        setGeoJson({
          type: "FeatureCollection",
          features: features,
        });

      } catch (error) {
        console.error("API call error:", error);
        toast({
          title: "Error fetching order details",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.warn("session.user.access or orderId is undefined.");
    }
  };
  useEffect(() => {
    if (session?.user?.access && orderId) {
      fetchOrderDetailes(session?.user?.access, orderId)
    }
  }, [session?.user?.access, orderId])

  const onAssignEmployeeHandler = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    const data = {
      employee_id: selectedEmployeeId,
    };

    if (session?.user?.access && orderId) {
      setLoading(true);
      try {
        const response = await assignEmployee(session.user.access, orderId, data);
        toast({
          title: "Success",
          description: response.message,
          variant: "success",
          className: "bg-green-200",
          duration: 2000
        });
        setOrderProp((prev) => ({
          ...prev,
          order_status: "approved"
        }));
        setOrderProp((prev) => ({
          ...prev,
          employee: selectedEmployeeId
        }))
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 2000
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Session or order id is invalid",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const onRejectOpen = (e) => {
    e.preventDefault();
    setRejectDialogOpen(true);
  }

  return (
    <Dialog open={searchParam.get("orderId") ? true : false} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[70%] max-h-[85%] overflow-y-scroll min-h-80 bg-gray-900 text-gray-100 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100"></DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex">
            {/* Left Side (Map and Form) */}
            <div className="w-1/2 mr-4">
              {/* Map Skeleton */}
              <div className="mr-2 w-full h-2/3 rounded-md border-2 border-gray-700 p-1 bg-gray-800 animate-pulse">
                <div className="w-full h-full bg-gray-700 rounded-md"></div>
              </div>

              {/* Form Skeleton */}
              <div className="w-full flex flex-col mt-2">
                <div className="w-full flex flex-col">
                  <div className="my-1 h-4 w-1/3 bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="w-full">
                    <div className="py-1 rounded-md border bg-gray-800 border-black w-full h-10 bg-gray-700 animate-pulse"></div>
                    <div className="bg-gray-600 py-1 rounded hover:bg-gray-700 text-white font-medium my-2 flex justify-center items-center w-full h-8 bg-gray-700 animate-pulse"></div>
                    <div className="bg-gray-600 w-full py-1 hover:bg-gray-700 rounded text-white font-medium flex justify-center items-center h-8 bg-gray-700 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side (Order Details and Buttons) */}
            <div className="min-h-full max-h-screen w-[45%]">
              {/* Order Details Skeleton */}
              <div className="border border-gray-500 shadow rounded-md grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 grid-cols-1">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="p-2 w-full rounded-md flex flex-col">
                    <div className="whitespace-nowrap h-4 w-1/2 bg-gray-700 rounded-md animate-pulse"></div>
                    <div className="bg-gray-700 rounded-md w-full p-1 h-8 mt-1 animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Buttons Skeleton */}
              <div>
                <div className="w-full bg-gray-800 hover:bg-gray-700 my-3 p-2 text-gray-100 flex justify-center items-center rounded-md h-10 bg-gray-700 animate-pulse"></div>
                <div className="w-full bg-gray-800 hover:bg-gray-700 my-3 p-2 text-gray-100 flex justify-center items-center rounded-md h-10 bg-gray-700 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex ">
            <div className="w-1/2 mr-4">
              <div className="mr-2 w-full h-2/3 rounded-md border-2 border-gray-700 p-1 bg-gray-800">
                <MapComponent satelliteData={operatorData} />
              </div>
              <div className="w-full flex flex-col">
                <form className="w-full mt-2">
                  <div className="w-full flex flex-col">
                    <p className="my-1">Assign task to:- </p>

                    <div className="w-full">
                      <select
                        className="py-1 rounded-md border bg-gray-800 border-black w-full"
                        value={selectedEmployeeId || ""}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      >
                        {!selectedEmployeeId && <option value="">Select Employee</option>}
                        {empList.length > 0 ? (
                          empList.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.first_name} {employee.last_name}
                            </option>
                          ))
                        ) : (
                          <option>Loading...</option>
                        )}
                      </select>

                      <button
                        className="bg-green-600 py-1 rounded  hover:bg-green-700
               text-white font-medium my-2 flex justify-center items-center w-full"
                        onClick={onAssignEmployeeHandler}
                        disabled={isLoading}
                      >
                        {/* <TiTick className="text-2xl text-white" /> */}
                        <Check />
                        {orderProp.employee
                          ? (loading ? "Reassigning..." : "Reassign")
                          : (loading ? "Assigning..." : "Assign Task")}


                      </button>
                      {orderProp.order_status === "approved" ? (
                        <div></div>
                      ) : (

                        <button
                          className="bg-red-600 w-full py-1  hover:bg-red-700 rounded text-white font-medium flex justify-center items-center"
                          onClick={(e) => onRejectOpen(e)}
                        >
                          <Trash2 className="mr-1" />
                          Reject Request
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="min-h-full max-h-screen w-[45%]">
              <div className="border border-gray-500 shadow rounded-md grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 grid-cols-1">
                {[
                  { label: "Order Id", value: orderData?.order?.id },
                  { label: "Tasking Method", value: orderProp.order_type },
                  { label: "Area", value: `${orderProp.area} km²` },
                  { label: "Ticket Name", value: orderProp.name },
                  { label: "Operators Name", value: orderProp.operators },
                  { label: "Resolution", value: orderProp.resolution },
                  { label: "Date from-to", value: `${formatDate(orderProp.date_from)}-${formatDate(orderProp.date_to)}` },
                  { label: "Order Date", value: formatDateTime(orderProp.created_at) }
                ].map((item, index) => (
                  <div key={index} className="p-2 w-full rounded-md flex flex-col">
                    <label className="whitespace-nowrap text-gray-300">{item.label}:</label>
                    <p className="bg-gray-700 rounded-md w-full p-1 text-gray-100">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <CommentDialog comments={comments} orderId={orderId} setComments={setComments}>
                  <button
                    className="w-full bg-gray-800 hover:bg-gray-700 my-3 p-2 text-gray-100 flex justify-center items-center rounded-md"
                  >
                    Comments
                  </button>
                </CommentDialog>
                <OperatorsDialog tableData={tableData}>
                  <button
                    className="w-full bg-gray-800 hover:bg-gray-700 my-3 p-2 text-gray-100 flex justify-center items-center rounded-md"
                  >
                    Operator Data
                  </button>
                </OperatorsDialog>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          {/* <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-gray-100">
              Save changes
            </Button> */}
        </DialogFooter>
        <RejectDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          orderId={orderId}
          setOrderProp={setOrderProp}
        />
      </DialogContent>
    </Dialog>
  )
}
