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

export default function SearchProduct() {
    const { data: session } = useSession();
    const { operators, setOperators, cloud_cover_percentage, setCloudCoverPercentage, date_from, setDateFrom, date_to, setDateTo, operatorGeoData, setOperaorGeoData } = useTool();
    const { map,hoverGeoJonData, setHoverGeoJsonData } = useContext(MapContext);
    const [selectedSatellites, setSelectedSatellites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsedIds, setCollapsedIds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [productList, setProductList] = useState([]);
    const [hoverLayer, setHoverLayer] = useState(null);
  const [imageLayer, setImageLayer] = useState(null);

    useEffect(() => {
        const fetchOperatorData = async () => {
            if (operators && date_from && date_to && operatorGeoData) {
                console.log(cloud_cover_percentage, date_from, date_to, operatorGeoData);
                try {
                    setIsLoading(true);
                    const response = await getOperatorData(
                        "JILIN",
                        1,
                        10,
                        JSON.stringify(operatorGeoData),
                        cloud_cover_percentage,
                        date_from,
                        date_to,
                        session?.user?.access
                    );
                    setProductList(response);
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
        //   opacity: 0.7,
          extent: extent  // Constrain image to polygon extent
        });
    
        if (map) {
          // Add layers
          map.addLayer(vectorLayer);
          map.addLayer(newImageLayer);
          setHoverLayer(vectorLayer);
          setImageLayer(newImageLayer);
    
          // Fit view to polygon with padding
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 500,
            maxZoom: 16  // Prevent over-zooming
          });
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

    const handleCheckboxChange = (id, checked) => {
        let updatedSatellites;

        if (checked) {
            updatedSatellites = [...selectedSatellites, id];
        } else {
            updatedSatellites = selectedSatellites.filter(satelliteId => satelliteId !== id);
        }

        setSelectedSatellites(updatedSatellites);
    };

    const OnSubmitHandler = () => {
        console.log("Submit request");
    };

    const handlePageChange = () => {
        console.log("Cancel request");
    };

    const filterProduct = productList.filter(product =>
        product.satelliteName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col gap-2 rounded-lg backdrop-blur-sm font-inter" >
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
                    {filterProduct.map((obj) => (
                        <div key={obj?.id} className='bg-[#202A33] border overflow-x-auto mx-1 my-2 rounded text-white p-3 flex gap-3 hover:bg-[#28455e]'
                            onMouseEnter={() => handleMouseEnter(obj?.imageGeo, obj?.jpg)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className=''>
                                <Image
                                    src={obj?.jpg}
                                    width={100}
                                    height={100}
                                    alt='image'
                                    className='rounded-md'
                                />
                            </div>
                            <div className='flex flex-col font-extralight gap-1'>
                                <span className='text-md font-bold'>{obj?.imagingTime}</span>
                                <span className='text-xs'>Satellite Name: {obj?.satelliteName}</span>
                                <span className='text-xs cursor-pointer' onClick={() => toggleCollapse(obj?.id)}>
                                    Product ID: {collapsedIds[obj?.id] ? obj?.productId : `${obj?.productId.toString().slice(0, 6)}...`}
                                </span>
                            </div>
                            <Checkbox
                                colorscheme="#202A33"   
                                ischecked={selectedSatellites.includes(obj?.id) ? "true" : undefined}
                                onChange={e => handleCheckboxChange(obj?.id, e.target.checked)}
                                className='ml-2 '
                                id={obj?.id}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="drop-shadow-sm flex w-full justify-between my-2 gap-2">
                <button
                    className="w-full h-[38px] flex justify-center items-center rounded ml-2 hover:border hover:border-red-600 text-sm font-bold"
                    style={{
                        background: "#202A33",
                        color: "rgba(204, 204, 204, 1)",
                    }}
                    onClick={handlePageChange}
                >
                    Cancel request
                </button>
                <button
                    className="w-full h-[38px] flex justify-center items-center hover:border hover:border-green-600 rounded mr-2 text-sm font-bold"
                    style={{
                        background: "#202A33",
                        color: "rgba(204, 204, 204, 1)",
                    }}
                    onClick={OnSubmitHandler}
                >
                    Submit request
                </button>
            </div>
        </div>
    );
}