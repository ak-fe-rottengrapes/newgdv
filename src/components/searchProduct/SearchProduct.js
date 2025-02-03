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

export default function SearchProduct() {
    const { data: session } = useSession();
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
        setOperaorGeoData } = useTool();
    const { map, hoverGeoJonData, setHoverGeoJsonData } = useContext(MapContext);
    const [selectedSatellites, setSelectedSatellites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsedIds, setCollapsedIds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [hoverLayer, setHoverLayer] = useState(null);
    const [imageLayer, setImageLayer] = useState(null);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const fetchOperatorData = async () => {
            if (operators && date_from && date_to && operatorGeoData) {
                console.log(cloud_cover_percentage, date_from, date_to, operatorGeoData);
                try {
                    setIsLoading(true);
                    const response = await getOperatorData(
                        "JILIN,MAXAR",
                        1,
                        10,
                        JSON.stringify(operatorGeoData),
                        cloud_cover_percentage,
                        date_from,
                        date_to,
                        session?.user?.access
                    );
                    const combinedProducts = [...response.Jilin, ...response.Maxar]; // Combine both arrays
                    setProductList(combinedProducts); // Update to handle the new data structure
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        fetchOperatorData();
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

    const toggleCollapse = id => {
        setCollapsedIds(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const handleCheckboxChange = (product, checked) => {
        let updatedSatellites = { ...selectedSatellites };
        let updatedSatellitesDetails = { ...selectedSatellitesDetails };
    
        if (checked) {
            if (!updatedSatellites[product.satelliteName]) {
                updatedSatellites[product.satelliteName] = [];
                updatedSatellitesDetails[product.satelliteName] = [];
            }
            updatedSatellites[product.satelliteName].push(product);
            updatedSatellitesDetails[product.satelliteName].push(product);
        } else {
            updatedSatellites[product.satelliteName] = updatedSatellites[product.satelliteName].filter(
                satellite => satellite.id !== product.id
            );
            updatedSatellitesDetails[product.satelliteName] = updatedSatellitesDetails[product.satelliteName].filter(
                satellite => satellite.id !== product.id
            );
            if (updatedSatellites[product.satelliteName].length === 0) {
                delete updatedSatellites[product.satelliteName];
                delete updatedSatellitesDetails[product.satelliteName];
            }
        }
    
        setSelectedSatellites(updatedSatellites);
        setSelectedSatellitesDetails(updatedSatellitesDetails);
    };
console.log("selectedSatellites", selectedSatellitesDetails);
    const OnSubmitHandler = () => {
        // setOpen(true);
        const generateUniqueOrderId = (userId) => {
            const unixTimestamp = Math.floor(Date.now() / 1000);
            const uniqueOrderId = `${userId}-${unixTimestamp}`;
            return uniqueOrderId;

        };
        const orderIdName = generateUniqueOrderId(session?.user?.user_id);
        setName(orderIdName);
        setSatelliteData({selectedSatellites});
        router.push('/user/AddToCart');
        console.log("Submit request");
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

        const layers = map.getLayers().getArray();
        layers.forEach(layer => {
            if (layer instanceof VectorLayer) {
                map.removeLayer(layer);
            }
        });
    };

    const filterProduct = productList.filter(product =>
        product.satelliteName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOrder = async () => {
        const generateUniqueOrderId = (userId) => {
            const unixTimestamp = Math.floor(Date.now() / 1000);
            const uniqueOrderId = `${userId}-${unixTimestamp}`;
            return uniqueOrderId;

        };
        const orderIdName = generateUniqueOrderId(session?.user?.user_id);
        const data = {
            order_type: order_type,
            date_from: date_from,
            date_to: date_to,
            resolution: resolution,
            area: area,
            cloud_cover_percentage: cloud_cover_percentage,
            name: orderIdName,
            note: note,
            ona_percentage: ona_percentage,
            operators: operators,
            satellite_data: selectedSatellites,
        }
        console.log(data)
    }

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

            {isLoading ? (
                <div className='border rounded-md flex justify-center items-center h-full'>
                    {/* Skeleton Loading Placeholder */}
                    <div className='h-[calc(100vh-180px)] w-full border rounded-lg overflow-y-auto'>
                        {[...Array(5)].map((_, index) => ( // Render 5 skeleton placeholders
                            <div key={index} className='bg-[#202A33] border mx-1 my-2 rounded p-3 flex gap-3 animate-pulse'>
                                {/* Image Placeholder */}
                                <div className='w-[100px] h-[100px] bg-gray-700 rounded-md'></div>
                                {/* Text Placeholder */}
                                <div className='flex flex-col gap-2 flex-1'>
                                    <div className='h-4 bg-gray-700 rounded w-3/4'></div>
                                    <div className='h-3 bg-gray-700 rounded w-1/2'></div>
                                    <div className='h-3 bg-gray-700 rounded w-2/3'></div>
                                </div>
                                {/* Checkbox Placeholder */}
                                <div className='w-5 h-5 bg-gray-700 rounded ml-2'></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='h-[calc(100vh-180px)] border rounded-lg overflow-y-auto'>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="bg-[#202A33] border border-gray-600 rounded-lg p-4 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold mb-2">Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Order Type:</span>
                                    <span>{order_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Date Range:</span>
                                    <span>{`${date_from} - ${date_to}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Resolution:</span>
                                    <span>{resolution}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Area:</span>
                                    <span>{area} km²</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Cloud Cover:</span>
                                    <span>{cloud_cover_percentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Name:</span>
                                    <span>{name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Note:</span>
                                    <span>{note}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">ONA Percentage:</span>
                                    <span>{ona_percentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Operators:</span>
                                    <span>{operators.join(', ')}</span>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
                                    onClick={() => handleCreateOrder()}
                                >
                                    Submit
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {filterProduct.map((obj, index) => (
                        <div
                            key={`${obj?.id}-${index}`} // Use a combination of id and index as the key
                            className="bg-[#202A33] border border-gray-600 overflow-hidden mx-2 my-2 rounded-lg text-white p-2 flex items-center gap-4 hover:bg-[#28455e] transition-all"
                            onMouseEnter={() => handleMouseEnter(obj?.imageGeo, obj?.jpg)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Image Section */}
                            <div className="w-16 h-20 flex-shrink-0">
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
                            <div className="flex flex-col flex-grow gap-1">
                                <span className="text-md font-bold">
                                    {obj?.imagingTime
                                        ? new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                        }).format(new Date(obj.imagingTime.replace(' ', 'T')))
                                        : ''}
                                </span>
                                <span className="text-xs text-gray-300">Satellite: {obj?.satelliteName}</span>
                                <span className='text-xs text-gray-300'>Cloud: {obj?.cloudPercent?.toFixed(2)}%</span>
                            </div>

                            {/* Price & Min Order Size Above Checkbox */}
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-md font-bold">${obj?.price_per_sqkm}/km<sup>2</sup></span>

                                {/* Checkbox */}
                                <button
                                    onClick={() => handleCheckboxChange(obj, !selectedSatellites[obj.satelliteName]?.some(satellite => satellite.id === obj.id))}
                                    className={`mt-2 bg-[#202A33] border border-gray-600 rounded-2xl p-1 text-white text-xs transition-all duration-300 ease-in-out 
${selectedSatellites[obj.satelliteName]?.some(satellite => satellite.id === obj.id) ? 'bg-gray-600' : 'hover:bg-gray-700 hover:border-gray-400'}
`}
                                >
                                    {selectedSatellites[obj.satelliteName]?.some(satellite => satellite.id === obj.id) ? 'Added' : 'Add to Cart'}
                                </button>
                                <span className="text-xs">Min.size: {obj?.min_order_size} km<sup>2</sup></span>
                            </div>
                        </div>
                    ))}


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
            </div>
        </div>
    );
}