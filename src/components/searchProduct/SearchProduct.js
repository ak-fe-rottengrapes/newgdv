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

    const toggleShowFull = () => {
        setShowFull(prev => !prev);
    };

    // Reference to the map container and the map instance
    const mapRef = useRef(null)
    const mapInstance = useRef(null)

    useEffect(() => {
        setTimeout(() => {
            console.log('mapRef.current', mapRef.current)
            if (mapRef.current && !mapInstance.current) {
                mapInstance.current = new Map({
                    target: mapRef.current,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
                    ],
                    view: new View({
                        center: [8742511, 2409708],
                        zoom: 5      // Default zoom level
                    }),
                })

                // Create GeoJSON object
                const geoJsonObject = {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: clickedCard?.imageGeo
                        }
                    ]
                };

                const userPolygon = {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: location
                        }
                    ]
                }
                console.log("userPolygon", userPolygon);
                console.log(location)
                // Create vector source and layer for polygon
                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(geoJsonObject, {
                        featureProjection: 'EPSG:3857',
                        dataProjection: 'EPSG:4326'
                    })
                });

                const userVectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(userPolygon, {
                        featureProjection: 'EPSG:3857',
                        dataProjection: 'EPSG:4326'
                    })
                });

                const userVectorLayer = new VectorLayer({
                    source: userVectorSource,
                    style: {
                        'fill-color': 'rgba(51, 152, 167, 0.2)',
                        'stroke-color': '#192028',
                        'stroke-width': 2
                    },
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: {
                        'fill-color': 'rgba(51, 152, 167, 0.2)',
                        'stroke-color': '#ffcc33',
                        'stroke-width': 2
                    },
                });
                const extent = userVectorSource.getExtent();
                if (mapInstance.current) {
                    mapInstance.current.addLayer(vectorLayer);
                    mapInstance.current.addLayer(userVectorLayer);
                    mapInstance.current.getView().fit(extent, {
                        padding: [50, 50, 50, 50],
                        duration: 500,
                        maxZoom: 14  // Prevent over-zooming
                    });
                }
            }
        }, 150);

        // Clean up the map instance on component unmount
        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(null)
                mapInstance.current = null
            }
        }
    }, [addToCart])

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
        setSatelliteData({ selectedSatellites });
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
                <div className='h-[calc(100vh-180px)]  border rounded-lg overflow-y-auto'>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="bg-[#202A33] border border-gray-600 rounded-lg overflow-x-auto p-6 text-white w-[400px] sm:w-[500px] md:w-[600px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold mb-4 text-center text-gray-200">
                                    Order Details
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-1 border rounded-md p-2 shadow-md border-gray-700">
                                {[
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

                    {/* <Dialog open={addToCart} onOpenChange={setAddToCart}>

                        <DialogContent className="bg-[#202A33] border border-gray-600 rounded-lg h-[calc(100vh-50px)] overflow-y-auto p-5 text-white min-w-[60%]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-center text-gray-200">
                                    Add to Cart
                                </DialogTitle>
                            </DialogHeader>
                            <div className='flex justify-between items-center gap-2'>
                                <div className="flex w-full items-center gap-2 border rounded-md p-2 shadow-md border-gray-700">
                                    <div className="flex justify-center relative">
                                        {clickedCard?.jpg ? (
                                            <div className="w-16 h-20 flex-shrink-0 relative">
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
                                            <div className="w-16 h-20 flex-shrink-0 bg-gray-700 rounded-lg flex text-xs items-center justify-center text-gray-400">
                                                No Image Available
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-grow gap-1">
                                        <span className="text-md font-bold">
                                            {clickedCard?.imagingTime
                                                ? new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                }).format(new Date(clickedCard.imagingTime.replace(' ', 'T')))
                                                : ''}
                                        </span>
                                        <span className="text-xs text-gray-300">
                                            Satellite: {clickedCard?.satelliteName}
                                        </span>
                                        <span className='text-xs text-gray-300'>
                                            Cloud: {clickedCard?.cloudPercent?.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-md font-bold">
                                            ${clickedCard?.price_per_sqkm}/km<sup>2</sup>
                                        </span>
                                        <span className="text-xs">
                                            Min.size: {clickedCard?.min_order_size} km<sup>2</sup>
                                        </span>
                                    </div>
                                </div>
                                <div className='w-full flex justify-around'>
                                    <button
                                        className="bg-[#202A33] border border-gray-600 rounded-lg px-4 py-2 text-white text-sm transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400"
                                        onClick={handleFullImage}
                                    >
                                        Full Image
                                    </button>
                                    <button
                                        className="bg-[#202A33] border border-gray-600 rounded-lg px-4 py-2 text-white text-sm transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400"
                                    // onClick={handleDrawPolygon}
                                    >
                                        Draw Polygon
                                    </button>
                                </div>
                            </div>
                            <div
                                ref={mapRef}
                                className='rounded-md w-full border border-gray-700 shadow-md'
                                style={{ height: '400px' }}
                            >
                            </div>
                            <DialogFooter>
                                <div className='flex w-1/3 justify-between gap-2'>
                                    <Button
                                        className='bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full'
                                        onClick={() => setAddToCart(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button className='bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full'>
                                        Submit
                                    </Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> */}

                    {filterProduct.map((obj, index) => (
                        <div
                            key={`${obj?.id}-${index}`} // Use a combination of id and index as the key
                            className="bg-[#202A33] border border-gray-600 overflow-hidden mx-2 my-2 rounded-lg text-white p-2 flex items-center gap-4 hover:bg-[#28455e] transition-all"
                            onMouseEnter={() => handleMouseEnter(obj?.imageGeo, obj?.jpg)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleCardDetails(obj)}
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
                                    onClick={(e) => handleAddToCartClick(obj, e)}
                                    className='mt-2 bg-[#202A33] border border-gray-600 rounded-2xl p-1 text-white text-xs transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400'
                                >
                                    Add to Cart
                                </button>

                                {/* <button
                                    onClick={() => handleCheckboxChange(obj, !selectedSatellites[obj.satelliteName]?.some(satellite => satellite.id === obj.id))}
                                    className={`mt-2 bg-[#202A33] border border-gray-600 rounded-2xl p-1 text-white text-xs transition-all duration-300 ease-in-out 
${selectedSatellites[obj.satelliteName]?.some(satellite => satellite.id === obj.id) ? 'bg-gray-600' : 'hover:bg-gray-700 hover:border-gray-400'}
`}
                                >
                                    {selectedSatellites[obj.satelliteName]?.some(satellite => satellite.id === obj.id) ? 'Added' : 'Add to Cart'}
                                </button> */}
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
                <AddToCartDialog addToCart={addToCart} setAddToCart={setAddToCart} clickedCard={clickedCard} setClickedCard={setClickedCard} />
            </div>
        </div>
    );
}