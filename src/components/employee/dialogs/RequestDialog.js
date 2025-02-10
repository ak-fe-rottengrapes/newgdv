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

export default function RequestDialog({ children, show, setShow, orderId }) {
  const { data: session } = useSession()
  const { setGeoJson } = useEmployeeContext()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast
  let [orderData, setOrderData] = useState({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  let [orderProp, setOrderProp] = useState({});
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [operatorData, setOperatorData] = useState([])
  const [comments, setComments] = useState([])
  const [tableData, setTableData] = useState([]);
  const searchParam = useSearchParams()
  const router = useRouter()
  const handleAddLink = async (e) => {
    setLoading(true)
    e.preventDefault()
    const data = {
      imagery_url: link
    }
    try {
      const response = await addImageryLink(session.user.access, orderId, data);
      toast.success("Link added succesfully")
      setLink("");
      fetchOrderDetailes();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
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



  const fetchOrderDetailes = async () => {
    setIsLoading(true);
    if (session?.user?.access && orderId) {
      try {
        const response = await getOrderDetails(session.user.access, orderId);
        console.log(response)
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

        if (response.order?.properties?.satellite_data) {
          response.order.properties.satellite_data.JILIN.forEach((satellite) => {
            if (satellite.imageGeo) {
              features.push({
                type: "Feature",
                geometry: satellite.imageGeo,
                properties: {
                  productId: satellite.productId,
                  satelliteId: satellite.satelliteId,
                },
              });
            }
          });
        }
        console.log("Satellite Data: ", response.order?.properties?.satellite_data)

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
    if ( session?.user?.access && orderId) {
      fetchOrderDetailes(session?.user?.access, orderId)
    }
  }, [session?.user?.access, orderId])
  return (
    <Dialog open={searchParam.get("orderId") ? true : false}  onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[70%] max-h-[85%] overflow-y-scroll min-h-80 bg-gray-900 text-gray-100 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100"></DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="h-full w-full flex justify-center items-center text-gray-300">
            loading...
          </div>
        ) : (
          <div className="flex ">
            <div className="w-1/2 mr-4">
              <div className="mr-2 w-full h-2/3 rounded-md border-2 border-gray-700 p-1 bg-gray-800">
                <MapComponent />
              </div>
              <div className="w-full flex flex-col">
                <form className="w-full mt-2">
                  <div className="mb-4">
                    <label htmlFor="linkInput" className="block text-sm font-medium text-gray-300 mb-1">
                      Enter Link:
                    </label>
                    <input
                      id="linkInput"
                      type="text"
                      defaultValue={orderData?.order?.properties?.imagery_url}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <button
                    className="bg-green-700 py-1 rounded hover:bg-green-800 text-gray-100 font-medium my-2 flex justify-center items-center w-full disabled:opacity-50"
                    onClick={handleAddLink}
                    disabled={isLoading}
                  >
                    <TiTick className="text-2xl text-gray-100" />
                    {loading
                      ? "Sending..."
                      : orderData?.order?.properties?.imagery_url
                        ? "Edit Link"
                        : "Send Link"}
                  </button>
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
      </DialogContent>
    </Dialog>
  )
}
