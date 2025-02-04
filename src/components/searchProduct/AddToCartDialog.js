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
import { Draw, Modify, Snap } from 'ol/interaction'; // Add these imports
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { getArea } from 'ol/sphere';
import Overlay from 'ol/Overlay';
import { unByKey } from 'ol/Observable';
import { booleanWithin } from '@turf/turf'; // Add this import
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
import { useToast } from '@/hooks/use-toast';

const AddToCartDialog = ({ addToCart, setAddToCart, clickedCard, setClickedCard }) => {
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()
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
    const mapRef = useRef(null)
    const mapInstance = useRef(null)

    const [drawInteraction, setDrawInteraction] = useState(null); // Add this state
    const [modifyInteraction, setModifyInteraction] = useState(null); // Add this state
    const [snapInteraction, setSnapInteraction] = useState(null); // Add this state
    const [vectorLayer, setVectorLayer] = useState(null); // Add this state

    const helpTooltipElementRef = useRef(null);
    const helpTooltipRef = useRef(null);
    const measureTooltipElementRef = useRef(null);
    const measureTooltipRef = useRef(null);
    const sketchRef = useRef(null);
    const overlaysRef = useRef([]);

    const [drawPolygonPrice, setDrawPolygonPrice] = useState(0);
    const [drawArea, setDrawArea] = useState(0);

    const createMeasureTooltip = () => {
        if (measureTooltipElementRef.current) {
            measureTooltipElementRef.current.remove();
        }
        measureTooltipElementRef.current = document.createElement('div');
        measureTooltipElementRef.current.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltipRef.current = new Overlay({
            element: measureTooltipElementRef.current,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        mapInstance.current.addOverlay(measureTooltipRef.current);
        overlaysRef.current.push(measureTooltipRef.current);
    };

    const createHelpTooltip = () => {
        if (helpTooltipElementRef.current) {
            helpTooltipElementRef.current.remove();
        }
        helpTooltipElementRef.current = document.createElement('div');
        helpTooltipElementRef.current.className = 'ol-tooltip hidden';
        helpTooltipRef.current = new Overlay({
            element: helpTooltipElementRef.current,
            offset: [15, 0],
            positioning: 'center-left',
        });
        mapInstance.current.addOverlay(helpTooltipRef.current);
        overlaysRef.current.push(helpTooltipRef.current);
    };

    const formatArea = (polygon) => {
        const area = getArea(polygon) / 1e6; // convert to km²
        return `${Math.round(area * 100) / 100} km²`;
    };

    const clearExisting = () => {
        overlaysRef.current.forEach(overlay => {
            if (overlay) {
                mapInstance.current.removeOverlay(overlay);
            }
        });
        overlaysRef.current = [];

        if (vectorLayer) {
            vectorLayer.getSource().clear();
        }

        if (measureTooltipElementRef.current) {
            measureTooltipElementRef.current.remove();
            measureTooltipElementRef.current = null;
        }
        if (helpTooltipElementRef.current) {
            helpTooltipElementRef.current.remove();
            helpTooltipElementRef.current = null;
        }
    };

    const updateMeasureTooltip = (geometry, position) => {
        const output = formatArea(geometry);
        if (measureTooltipElementRef.current) {
            measureTooltipElementRef.current.innerHTML = output;
            measureTooltipRef.current.setPosition(position);
        }
    };

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

    const [drawOrFull, setDrawOrFull] = useState('');

    const [drawPolygon, setDrawPolygon] = useState(null);
    const handleFullImage = () => {
        setDrawOrFull('full');
        setDrawPolygon(clickedCard?.imageGeo);
        if (mapInstance.current && drawInteraction) {
            mapInstance.current.removeInteraction(drawInteraction);
        }
    }

    const handleDrawPolygon = () => {
        setDrawOrFull('polygon');
        if (mapInstance.current) {
            const source = vectorLayer ? vectorLayer.getSource() : new VectorSource(); // Use existing vectorLayer if available
            if (!vectorLayer) {
                const newVectorLayer = new VectorLayer({
                    source: source,
                    style: (feature) => {
                        const area = getArea(feature.getGeometry()) / 1e6;
                        const userPolygon = {
                            type: 'Feature',
                            geometry: location
                        };

                        const clickedCardPolygon = {
                            type: 'Feature',
                            geometry: clickedCard?.imageGeo
                        };

                        const drawnPolygon = new GeoJSON().writeFeatureObject(feature, {
                            featureProjection: 'EPSG:3857',
                            dataProjection: 'EPSG:4326'
                        });

                        const isWithinUserPolygon = booleanWithin(drawnPolygon, userPolygon);
                        const isWithinClickedCardPolygon = booleanWithin(drawnPolygon, clickedCardPolygon);

                        const isValid = area >= clickedCard?.min_order_size && area <= 10000 && isWithinUserPolygon && isWithinClickedCardPolygon;
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(50, 150, 250, 0.3)',
                            }),
                            stroke: new Stroke({
                                color: isValid ? '#192028' : 'red',
                                width: 2,
                            }),
                            image: new CircleStyle({
                                radius: 5,
                                fill: new Fill({
                                    color: '#ffcc33',
                                }),
                            }),
                        });
                    },
                });
                setVectorLayer(newVectorLayer);
                mapInstance.current.addLayer(newVectorLayer);
            }

            if (drawInteraction) mapInstance.current.removeInteraction(drawInteraction);
            if (modifyInteraction) mapInstance.current.removeInteraction(modifyInteraction);
            if (snapInteraction) mapInstance.current.removeInteraction(snapInteraction);

            createMeasureTooltip();
            createHelpTooltip();

            const draw = new Draw({
                source: source,
                type: 'Polygon',
            });

            let listener;
            draw.on('drawstart', (evt) => {
                // Clear existing polygons before drawing a new one
                source.clear();
                createMeasureTooltip();
                createHelpTooltip();

                sketchRef.current = evt.feature;
                let tooltipCoord = evt.coordinate;

                listener = sketchRef.current.getGeometry().on('change', (evt) => {
                    const geom = evt.target;
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    updateMeasureTooltip(geom, tooltipCoord);
                });
            });

            draw.on('drawend', (event) => {
                const feature = event.feature;
                const geom = feature.getGeometry();
                const area = getArea(geom) / 1e6;

                const userPolygon = {
                    type: 'Feature',
                    geometry: location
                };

                const clickedCardPolygon = {
                    type: 'Feature',
                    geometry: clickedCard?.imageGeo
                };

                const drawnPolygon = new GeoJSON().writeFeatureObject(feature, {
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                });

                const isWithinClickedCardPolygon = booleanWithin(drawnPolygon, clickedCardPolygon);

                if (!isWithinClickedCardPolygon) {
                    source.removeFeature(feature);
                    toast({
                        title: 'Error',
                        description: 'The drawn polygon must be within the existing polygons.',
                        variant: 'destructive',
                        duration: 2000
                    });
                } else if (area < clickedCard?.min_order_size || area > 10000) {
                    source.removeFeature(feature);
                    toast({
                        title: 'Error',
                        description: 'The area of the polygon must be between ' + clickedCard?.min_order_size + ' km² and 10,000 km².',
                        variant: 'destructive',
                        duration: 2000
                    });
                } else {
                    const geoData = {
                        type: "FeatureCollection",
                        features: [drawnPolygon]
                    };

                    setDrawPolygonPrice(area * clickedCard?.price_per_sqkm);
                    setDrawPolygon(geoData);
                    setDrawArea(area);

                    measureTooltipElementRef.current.className = 'ol-tooltip ol-tooltip-static';
                    measureTooltipRef.current.setOffset([0, -7]);

                    updateMeasureTooltip(geom, geom.getInteriorPoint().getCoordinates());
                }
                sketchRef.current = null;
                unByKey(listener);
            });
            console.log(drawPolygonPrice)

            const modify = new Modify({
                source: source,
                style: new Style({
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: '#ffcc33',
                        }),
                    }),
                }),
            });

            modify.on('modifystart', (evt) => {
                sketchRef.current = evt.features.getArray()[0];
            });

            modify.on('modifying', (evt) => {
                if (sketchRef.current) {
                    const geom = sketchRef.current.getGeometry();
                    const tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    updateMeasureTooltip(geom, tooltipCoord);
                }
            });

            modify.on('modifyend', (event) => {
                const feature = event.features.getArray()[0];
                const geom = feature.getGeometry();
                const area = getArea(geom) / 1e6;

                const userPolygon = {
                    type: 'Feature',
                    geometry: location
                };

                const clickedCardPolygon = {
                    type: 'Feature',
                    geometry: clickedCard?.imageGeo
                };

                const modifiedPolygon = new GeoJSON().writeFeatureObject(feature, {
                    featureProjection: 'EPSG:3857',
                    dataProjection: 'EPSG:4326'
                });

                const isWithinUserPolygon = booleanWithin(modifiedPolygon, userPolygon);
                const isWithinClickedCardPolygon = booleanWithin(modifiedPolygon, clickedCardPolygon);

                if (!isWithinClickedCardPolygon) {
                    toast({
                        title: 'Error',
                        description: 'The modified polygon must be within the existing polygons.',
                        variant: 'destructive',
                        duration: 1000
                    });
                } else if (area < clickedCard?.min_order_size || area > 10000) {
                    toast({
                        title: 'Error',
                        description: 'The area of the polygon must be between ' + clickedCard?.min_order_size + ' km² and 10,000 km².',
                        variant: 'destructive',
                        duration: 1000
                    })
                } else {
                    const geoData = {
                        type: "FeatureCollection",
                        features: [modifiedPolygon]
                    };
                    setDrawPolygonPrice(area * clickedCard?.price_per_sqkm);
                    setDrawPolygon(geoData);
                    setDrawArea(area);

                    const simplifiedData = {
                        type: "Polygon",
                        coordinates: geom.clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
                    };

                    updateMeasureTooltip(geom, geom.getInteriorPoint().getCoordinates());
                }
            });

            const snap = new Snap({ source: source });

            mapInstance.current.addInteraction(draw);
            mapInstance.current.addInteraction(modify);
            mapInstance.current.addInteraction(snap);

            setDrawInteraction(draw);
            setModifyInteraction(modify);
            setSnapInteraction(snap);
        }
    }

    useEffect(() => {
        // Clean up the draw interaction on component unmount
        return () => {
            if (mapInstance.current && drawInteraction) {
                mapInstance.current.removeInteraction(drawInteraction);
            }
        }
    }, [drawInteraction, addToCart, clickedCard]);

    const handleClose = () => {
        setAddToCart(false);
        setDrawPolygon(null);
        setDrawOrFull('');
        if (vectorLayer) {
            vectorLayer.getSource().clear();
        }
        if (mapInstance.current) {
            mapInstance.current.getOverlays().clear();
        }
        setDrawInteraction(null);
        setModifyInteraction(null);
        setSnapInteraction(null);
        setVectorLayer(null);
    }

    console.log("draw ", drawPolygon)

    const setSatelliteDataByName = () => {
        if (!clickedCard?.satelliteName) return;
        
        const newItem = {
            id: Number(clickedCard.id),
            satelliteId: clickedCard.satelliteId,
            productId: clickedCard.productId,
            imageGeo: drawPolygon,
            area: Number(drawArea.toFixed(2)),
            price: Number(drawPolygonPrice.toFixed(2)),
        };
    
        setSatelliteData(prevData => {
            // Check if ID already exists in array
            const exists = prevData[clickedCard.satelliteName]?.some(
                item => item.id === newItem.id
            );
    
            // Return existing data if duplicate found
            if (exists) {
                toast({
                    title: 'Error',
                    description: 'This item is already in the cart.',
                    variant: 'destructive',
                    duration: 1000
                })
                return prevData;
            }
    
            // Add new item if no duplicate
            return {
                ...prevData,
                [clickedCard.satelliteName]: [
                    ...(prevData[clickedCard.satelliteName] || []),
                    newItem
                ]
            };
        });
    };
    
    const handleAddToCart = () => {
        if (!clickedCard) return;
        setSatelliteDataByName();
        setAddToCart(false)
    };
    

    console.log("Satellite Data", satellite_data)

    return (
        <div>
            <Dialog open={addToCart} onOpenChange={(open) => { if (!open) handleClose(); }}>

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
                                <span className="text-md font-bold">
                                    ${drawPolygonPrice.toFixed(2)}
                                </span>
                                <span className="text-xs">
                                    Area: {drawArea.toFixed(2)} km<sup>2</sup>
                                </span>
                                <span className="text-xs">
                                    Min.size: {clickedCard?.min_order_size} km<sup>2</sup>
                                </span>
                            </div>
                        </div>
                        <div className='w-full flex justify-around'>
                            <button
                                onClick={handleFullImage}
                                className={`bg-[#202A33] border border-gray-600 rounded-lg px-4 py-2 text-white text-sm transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400 ${drawOrFull === 'full' ? 'bg-gray-400 border-2 border-green-700' : 'bg-gray-700'}`}
                            >
                                Full Image
                            </button>
                            <button
                                onClick={handleDrawPolygon}
                                className={`bg-[#202A33] border border-gray-600 rounded-lg px-4 py-2 text-white text-sm transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400 ${drawOrFull === 'polygon' ? 'bg-gray-400 border-2 border-green-700' : 'bg-gray-700'}`}
                            >
                                Draw Polygon
                            </button>
                        </div>
                    </div>
                    {/* OpenLayers map container */}
                    <div
                        ref={mapRef}
                        className='rounded-md w-full border border-gray-700 shadow-md'
                        style={{ height: '300px' }}
                    >
                    </div>
                    <DialogFooter>
                        <div className='flex w-1/3 justify-between gap-2'>
                            <Button
                                className='bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full'
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                            <Button className='bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full'
                                onClick={() => handleAddToCart()}>
                                Add To Cart
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddToCartDialog