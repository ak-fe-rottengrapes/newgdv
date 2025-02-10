'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { VscSearch } from "react-icons/vsc";
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { FaFilter } from "react-icons/fa";
import { useTool } from '@/app/context/ToolContext';
import { getOperatorData } from '../services/order/api';
import { useSession } from 'next-auth/react';
import { MapContext } from '@/app/context/MapContext';
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import Static from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import 'ol/ol.css'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import AddToCartDialog from './AddToCartDialog';
import { useToast } from '@/hooks/use-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ShoppingCart } from 'lucide-react';

export default function SearchProduct() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();
    const { activeTool,
        setActiveTool,
        imagery_type,
        setImageryType,
        resolution,
        setResolution,
        area,
        setArea,
        cloud_cover_percentage,
        setCloudCoverPercentage,
        date_from,
        setDateFrom,
        date_to,
        setDateTo,
        location,
        setLocation,
        name,
        setName,
        note,
        setNote,
        ona_percentage,
        setOnaPercentage,
        operators,
        setOperators,
        order_type,
        setOrderType,
        satellite_data,
        setSatelliteData,
        operatorGeoData,
        selectedSatellitesDetails,
        setSelectedSatellitesDetails,
        setOperaorGeoData,
        addToCartId, setAddToCartId } = useTool();
    const { map, hoverGeoJonData, setHoverGeoJsonData, addToCartMap,
        setAddToCartMap } = useContext(MapContext);
    const [selectedSatellites, setSelectedSatellites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsedIds, setCollapsedIds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [hoverLayer, setHoverLayer] = useState(null);
    const [imageLayer, setImageLayer] = useState(null);
    const [open, setOpen] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const [imgLoad, setImgLoad] = useState(false);
    const [addToCart, setAddToCart] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 10;

    const toggleShowFull = () => {
        setShowFull(prev => !prev);
    };

    const formatOperators = () => {
        if (!operators || operators.length === 0) return '';
        return operators.join(',');
    };


    const fetchOperatorData = async (pageNum = 1) => {
        try {
            if (operators && date_from && date_to && operatorGeoData) {
                setIsLoading(true);
                const response = await getOperatorData(
                    formatOperators(),
                    pageNum,
                    ITEMS_PER_PAGE,
                    JSON.stringify(operatorGeoData),
                    cloud_cover_percentage,
                    date_from,
                    date_to,
                    resolution,
                    ona_percentage,
                    order_type,
                    session?.user?.access
                );

                // Handle successful response
                const combinedProducts = [
                    ...(response.Jilin || []),
                    ...(response.Maxar || [])
                ].filter(Boolean);

                if (pageNum === 1) {
                    setProductList(combinedProducts);
                } else {
                    setProductList(prev => [...prev, ...combinedProducts]);
                }

                setHasMore(combinedProducts.length >= ITEMS_PER_PAGE);
            } else {
                router.push('/user/order');
                toast({
                    title: "Missing Parameters",
                    description: "Please select an operator, date range, and area to search for products",
                    className: 'bg-yellow-200 text-black',
                    duration: 2000,
                })
            }
        } catch (error) {
            // Handle different types of errors
            let errorMessage = "An unexpected error occurred";

            if (error.response) {
                // Server responded with an error status
                switch (error.response.status) {
                    case 400:
                        errorMessage = "Invalid request parameters";
                        break;
                    case 401:
                        errorMessage = "Authentication required";
                        router.push('/login');
                        break;
                    case 403:
                        errorMessage = "You don't have permission to access this resource";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later";
                        break;
                    default:
                        errorMessage = error.response.data?.message || "Failed to fetch operator data";
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "No response from server. Please check your connection";
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
                duration: 3000,
            });

            // Log the error for debugging
            console.error("Operator data fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchOperatorData(1);
    }, [operators, date_from, date_to, operatorGeoData, cloud_cover_percentage, session?.user?.access]);

    const handleMouseEnter = (coordinates, imageUrl) => {
        // Remove previous layers if they exist
        if (hoverLayer) {
            map.removeLayer(hoverLayer);
        }
        if (imageLayer) {
            map.removeLayer(imageLayer);
        }

        // Parse the stringified coordinates if they're passed as a string
        const parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;

        // Create GeoJSON object
        const geoJsonObject = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: parsedCoordinates
                }
            ]
        };

        // Create vector source and layer for polygon
        const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geoJsonObject, {
                featureProjection: 'EPSG:3857',
                dataProjection: 'EPSG:4326'
            })
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: {
                'fill-color': 'rgba(51, 152, 167, 0.2)',
                'stroke-color': '#ffcc33',
                'stroke-width': 2
            }
        });

        // Get the extent of the polygon in EPSG:3857
        const extent = vectorSource.getExtent();

        // Create image layer using the polygon's extent
        const newImageLayer = new ImageLayer({
            source: new Static({
                url: imageUrl,
                imageExtent: extent,
                projection: 'EPSG:3857'
            }),
            opacity: 0.8,
            extent: extent  // Constrain image to polygon extent
        });

        if (map) {
            // Add layers
            map.addLayer(vectorLayer);
            //   map.addLayer(newImageLayer);
            setHoverLayer(vectorLayer);
            //   setImageLayer(newImageLayer);

            // Fit view to polygon with padding
            // map.getView().fit(extent, {
            //     padding: [50, 50, 50, 50],
            //     duration: 500,
            //     maxZoom: 16  // Prevent over-zooming
            // });
        }
    };

    const handleMouseLeave = () => {
        if (map) {
            if (hoverLayer) {
                map.removeLayer(hoverLayer);
                setHoverLayer(null);
            }
            if (imageLayer) {
                map.removeLayer(imageLayer);
                setImageLayer(null);
            }
        }
    };

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };

    console.log("selectedSatellites", selectedSatellitesDetails);
    const OnSubmitHandler = () => {
        // setOpen(true);
        // const generateUniqueOrderId = (userId) => {
        //     const unixTimestamp = Math.floor(Date.now() / 1000);
        //     const uniqueOrderId = `${userId}-${unixTimestamp}`;
        //     return uniqueOrderId;

        // };
        // const orderIdName = generateUniqueOrderId(session?.user?.user_id);
        // setName(orderIdName);
        // setSatelliteData({ selectedSatellites });
        router.push('/user/AddToCart');
    };

    console.log("selectedSatellites", selectedSatellites);

    const handlePageChange = () => {

        setActiveTool(null);
        setImageryType('');
        setResolution(null);
        setArea(null);
        setCloudCoverPercentage(10);
        setDateFrom('');
        setDateTo('');
        setLocation(null);
        setName('');
        setNote('');
        setOnaPercentage(10);
        setOperators([]);
        setOrderType('');
        setSatelliteData(null);
        setOperaorGeoData(null);

        if (map) {
            // Get and remove vector layers
            const layers = map.getLayers().getArray();
            layers.forEach(layer => {
                if (layer instanceof VectorLayer) {
                    // Clear source
                    const source = layer.getSource();
                    source.clear();

                    // Remove layer
                    map.removeLayer(layer);
                }
            });

            // Remove all overlays
            const overlays = map.getOverlays();
            overlays.clear();

            // Force refresh
            map.updateSize();
            window.setTimeout(() => {
                map.renderSync();
            }, 200);
        }
    };

    const filterProduct = productList.filter(product =>
        product.satelliteName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [clickedCard, setClickedCard] = useState(null);
    const handleCardDetails = (obj) => {
        setOpen(true);
        setClickedCard(obj);
    }

    const handleAddToCartClick = (obj, e) => {
        e.stopPropagation();
        setAddToCart(true);
        setClickedCard(obj);
    }
    const isProductInCart = (product) => {
        // return selectedSatellitesDetails[product.satelliteName]?.includes(item => item.id === product.id);
        return addToCartId.includes(product.id);

    };

    const fetchMoreData = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchOperatorData(nextPage);
    };

    return (
        <div className="h-full flex flex-col justify-between gap-2 rounded-lg backdrop-blur-sm font-inter" >
            <span className="text-md p-1 text-center border font-bold rounded-lg bg-[#202A33]" style={{ color: "rgba(255, 255, 255, 1)" }}>
                Search Products
            </span>

            <div className="flex gap-2">
                <button className="bg-[#202A33] border w-1/6 flex items-center justify-center rounded-md">
                    <FaFilter className="text-sm" style={{ color: 'white' }} />
                </button>
                <input
                    type="text"
                    placeholder="search"
                    className="w-full border rounded-md p-1 bg-[#202A33] text-white text-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {isLoading && page === 1 ? (
                <div className='border rounded-md flex justify-center items-center h-full'>
                    {/* Skeleton Loading Placeholder */}
                    <div className='h-[calc(100vh-180px)] w-full  rounded-lg overflow-y-auto'>
                        {[...Array(5)].map((_, index) => ( // Render 5 skeleton placeholders
                            <div key={index} className='bg-[#202A33] border mx-1 my-2 rounded p-3 flex gap-3 animate-pulse'>
                                {/* Image Placeholder */}
                                <div className='w-16 h-20 bg-gray-700 rounded-md'></div>
                                {/* Text Placeholder */}
                                <div className='flex flex-col gap-2 flex-1'>
                                    <div className='h-4 bg-gray-700 rounded w-3/4'></div>
                                    <div className='h-3 bg-gray-700 rounded w-1/2'></div>
                                    <div className='h-3 bg-gray-700 rounded w-2/3'></div>
                                    <div className='h-3 bg-gray-700 rounded w-2/3'></div>
                                    <div className='h-3 bg-gray-700 rounded w-2/3'></div>
                                </div>
                                {/* Checkbox Placeholder */}
                                <div className='flex flex-col items-center gap-2'>
                                    <div className='w-10 h-5 bg-gray-700 rounded ml-2'></div>
                                    <div className='w-10 h-5 bg-gray-700 rounded ml-2'></div>
                                    <div className='w-12 h-5 bg-gray-700 rounded-2xl ml-2'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className='h-[calc(100vh-180px)] border rounded-lg overflow-y-auto'
                    id="scrollableDiv"
                    style={{ overflow: 'auto' }} // Ensure scrolling is enabled
                >
                    <InfiniteScroll
                        dataLength={productList.length} // Use productList instead of filterProduct
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="text-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            </div>
                        }
                        scrollableTarget="scrollableDiv"
                        endMessage={
                            <p className="text-center text-gray-500 py-4">
                                No more products to load.
                            </p>
                        }
                    >
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogContent className="bg-[#202A33] border border-gray-600 rounded-lg overflow-x-auto p-6 text-white w-[400px] sm:w-[500px] md:w-[600px]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold mb-4 text-center text-gray-200">
                                        Order Details
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-1 border rounded-md p-2 shadow-md border-gray-700">
                                    {[
                                        { label: "Total Price", value: `$${Number(clickedCard?.total_price).toFixed(2)}` },
                                        { label: "Satellite Name", value: clickedCard?.satelliteName },
                                        {
                                            label: "Date",
                                            value: clickedCard?.imagingTime
                                                ? new Intl.DateTimeFormat("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                }).format(new Date(clickedCard.imagingTime.replace(" ", "T")))
                                                : "",
                                        },
                                        { label: "Cloud Cover", value: `${clickedCard?.cloudPercent}%` },
                                        {
                                            label: "Price per Km²",
                                            value: `$${clickedCard?.price_per_sqkm}/km²`,
                                        },
                                        {
                                            label: "Minimum Order Size",
                                            value: `${clickedCard?.min_order_size} km²`,
                                        },
                                        { label: "Satellite ID", value: clickedCard?.satelliteId },
                                        { label: "Area", value: `${Number(clickedCard?.area_sq_km).toFixed(2)} km²` },
                                        { label: "Resolution", value: `${clickedCard?.resolution}%` },
                                        { label: "Off Nadir", value: `${clickedCard?.off_nadir}°` },

                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between border-gray-700 "
                                        >
                                            <span className="font-semibold text-sm text-gray-300">{item.label}:</span>
                                            <span className="text-gray-400 text-sm">{item.value}</span>
                                        </div>
                                    ))}

                                </div>

                                {/* Image Section */}
                                <div className="mt-4 flex justify-center">
                                    {clickedCard?.jpg ? (
                                        <div className="relative w-full max-w-[300px] h-[200px] flex items-center justify-center">
                                            {isLoading && (
                                                <div className="absolute text-gray-400">Loading...</div>
                                            )}
                                            <Image
                                                src={clickedCard.jpg}
                                                width={200}
                                                height={200}
                                                alt="Satellite Image"
                                                className="rounded-lg object-cover w-full h-full shadow-lg"
                                                onLoad={() => setIsLoading(false)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-[300px] h-[200px] bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {filterProduct.map((obj, index) => (
                            <div
                                key={`${obj?.id}-${index}`} // Use a combination of id and index as the key
                                className="bg-[#202A33] border border-gray-600 overflow-hidden mx-2 my-2 rounded-lg text-white p-2 flex items-center gap-4 hover:bg-[#28455e] transition-all"
                                onMouseEnter={() => handleMouseEnter(obj?.imageGeo, obj?.jpg)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleCardDetails(obj)}
                            >
                                {/* Image Section */}
                                <div className="w-16 h-24 flex-shrink-0">
                                    {obj.jpg ? (
                                        <Image
                                            src={obj?.jpg}
                                            width={80}
                                            height={80}
                                            alt="Satellite Image"
                                            className="rounded-md object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 rounded-md"></div>
                                    )}
                                </div>

                                {/* Details Section */}
                                <div className="flex flex-col flex-grow ">
                                    <span className="text-sm font-bold">
                                        {obj?.imagingTime
                                            ? new Intl.DateTimeFormat('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                            }).format(new Date(obj.imagingTime.replace(' ', 'T')))
                                            : ''}
                                    </span>

                                    <span className='text-xs text-gray-300'>Cloud: {obj?.cloudPercent?.toFixed(2)}%</span>
                                    <span className='text-xs text-gray-300'>Resolution: {obj?.resolution}%</span>

                                    <span className='text-xs text-gray-300'>Off Nadir: {obj?.off_nadir}<sup>o</sup></span>
                                    <span className="text-xs text-gray-300">Area: {Number(obj?.area_sq_km).toFixed(2)}/km<sup>2</sup></span>
                                    <span className="text-xs text-gray-300">Min.size: {obj?.min_order_size} km<sup>2</sup></span>
                                </div>

                                {/* Price & Min Order Size Above Checkbox */}
                                <div className="flex flex-col items-end ">
                                    <span className="text-sm font-bold">{obj?.satelliteName}</span>
                                    <span className="text-md font-bold">${obj?.price_per_sqkm}/km<sup>2</sup></span>

                                    <span className="text-xs font-bold">Price: ${Number(obj?.total_price).toFixed(2)}</span>

                                    <button
                                        onClick={(e) => handleAddToCartClick(obj, e)}
                                        disabled={isProductInCart(obj)}
                                        className={`mt-2 rounded-2xl p-1 text-xs transition-all duration-300 ease-in-out
                                    ${isProductInCart(obj)
                                                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                                : 'bg-[#202A33] border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        {isProductInCart(obj) ? 'Added' : <span className='flex gap-2 items-center justify-between px-2'>Add<ShoppingCart size={12} /></span>}
                                    </button>

                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            )}

            <div className="flex justify-between gap-2">
                <Button
                    className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
                    onClick={handlePageChange}
                >
                    Cancel request
                </Button>
                <Button
                    className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
                    onClick={OnSubmitHandler}
                >
                    Go to Cart
                </Button>
                <AddToCartDialog addToCart={addToCart} setAddToCart={setAddToCart} clickedCard={clickedCard} setClickedCard={setClickedCard} />
            </div>
        </div>
    );
}