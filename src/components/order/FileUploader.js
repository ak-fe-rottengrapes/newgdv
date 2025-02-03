'use client';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button } from '@/components/ui/button'
import { FileUp } from 'lucide-react';
import { useTool } from '@/app/context/ToolContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useDropzone } from "react-dropzone";
import { MapContext } from '@/app/context/MapContext';
import { GeoJSON, KML } from 'ol/format';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { getArea } from 'ol/sphere';
import { Style, Fill, Stroke, Text } from 'ol/style';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import shp from 'shpjs';
import JSZip from 'jszip';

const FileUploader = () => {
    const { map, setMap } = useContext(MapContext);
    const { activeTool, setActiveTool, location,
        setLocation, operatorGeoData,
        setOperaorGeoData,area,  setArea } = useTool();
    const isActive = activeTool === 'fileUpload';
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [warning, setWarning] = useState('');
    const [vectorLayer, setVectorLayer] = useState(null);
    

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    const handleFileUploadButtonClick = () => {
        setActiveTool('fileUpload');
        setOpen(true);
        if (vectorLayer) {
            map.removeLayer(vectorLayer);
            setVectorLayer(null);
        }
    }

    const handleFileUpload = () => {
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                let features;
                if (file.name.endsWith('.kml')) {
                    const kmlData = event.target.result;
                    features = new KML().readFeatures(kmlData, {
                        featureProjection: 'EPSG:3857'
                    });
                } else if (file.name.endsWith('.zip')) {
                    const zip = await JSZip.loadAsync(event.target.result);
                    const shpFile = zip.file(/\.shp$/i)[0];
                    const dbfFile = zip.file(/\.dbf$/i)[0];
                    const shxFile = zip.file(/\.shx$/i)[0];
                    const prjFile = zip.file(/\.prj$/i)[0];
                    if (shpFile && dbfFile && shxFile && prjFile) {
                        const shpArrayBuffer = await shpFile.async("arraybuffer");
                        const dbfArrayBuffer = await dbfFile.async("arraybuffer");
                        const shxArrayBuffer = await shxFile.async("arraybuffer");
                        const prjArrayBuffer = await prjFile.async("arraybuffer");
                        const geojson = await shp({
                            shp: shpArrayBuffer,
                            dbf: dbfArrayBuffer,
                            shx: shxArrayBuffer,
                            prj: prjArrayBuffer
                        });
                        features = new GeoJSON().readFeatures(geojson, {
                            featureProjection: 'EPSG:3857'
                        });
                    } else {
                        setWarning('The ZIP file must contain .shp, .dbf, .shx, and .prj files.');
                        return;
                    }
                } else {
                    const geojsonData = JSON.parse(event.target.result);
                    features = new GeoJSON().readFeatures(geojsonData, {
                        featureProjection: 'EPSG:3857'
                    });
                }
                const vectorSource = new VectorSource({
                    features: features,
                    strategy: bboxStrategy
                });
                const newVectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: (feature) => {
                        const area = getArea(feature.getGeometry()) / 1e6;
                        
                        return new Style({
                            fill: new Fill({
                                color: 'rgba(50, 150, 250, 0.3)',
                            }),
                            stroke: new Stroke({
                                color: '#192028',
                                width: 2,
                            }),
                            text: new Text({
                                font: '14px sans-serif',
                                offsetY: -15, // Move text above the polygon
                                fill: new Fill({
                                    color: '#ffffff',
                                }),
                                stroke: new Stroke({
                                    color: '#000000',
                                    width: 3,
                                }),
                                backgroundFill: new Fill({
                                    color: 'rgba(0, 0, 0, 0.5)',
                                }),
                                backgroundStroke: new Stroke({
                                    color: 'rgba(0, 0, 0, 0.5)',
                                    width: 2,
                                }),
                                padding: [5, 8, 5, 8],
                                text: `Area: ${area.toFixed(2)} km²`,
                                // Add rounded corners to the text background
                                borderRadius: 8
                            }),
                        });
                    }
                });
                
                const area = features.reduce((acc, feature) => acc + getArea(feature.getGeometry()), 0) / 1e6; // convert to km²
                if (area < 20) {
                    setWarning('The area of the polygon is less than 20 km².');
                } else if(area > 10000) {
                    setWarning('The area of the polygon is greater than 10,000 km².');
                }
                else {
                    if (vectorLayer) {
                        map.removeLayer(vectorLayer);
                    }
                    map.addLayer(newVectorLayer);
                    setVectorLayer(newVectorLayer);
                    const extent = vectorSource.getExtent();
                    map.getView().fit(extent, { duration: 1000 });

                    // Set the polygon data in the specified format
                    const geoData = {
                        type: "FeatureCollection",
                        features: features.map(feature => new GeoJSON().writeFeatureObject(feature, {
                            featureProjection: 'EPSG:3857',
                            dataProjection: 'EPSG:4326'
                        }))
                    };
                    setOperaorGeoData(geoData);

                    const simplifiedData = {
                        type: "Polygon",
                        coordinates: features[0].getGeometry().clone().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
                    };
                    setLocation(simplifiedData);
                    setArea(parseFloat(area.toFixed(2)));

                    setOpen(false);
                }
            };
            if (file.name.endsWith('.zip')) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        }
    };

    useEffect(() => {
        console.log('operatorGeoData', operatorGeoData);
        console.log('location', location);
        console.log('area', area);
    })

    useEffect(() => {
        if (!open) {
            setFiles([]);
        }
    }, [open]);

    return (
        <div>
            <Button
                className={`bg-[#2b3a4a] hover:bg-[#192028] hover:text-white
                    ${isActive ? 'bg-[#192028] text-white' : ''}
                    ${activeTool && !isActive ? 'cursor-not-allowed opacity-50' : ''}
                `}
                onClick={handleFileUploadButtonClick}
                disabled={false}
            >


                <FileUp className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#192028] text-white border border-[#2b3a4a]">
                    <DialogHeader>
                        <DialogTitle>Upload a File</DialogTitle>
                    </DialogHeader>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-500 p-6 rounded-lg text-center cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p className="text-gray-300">Drop the files here...</p>
                        ) : (
                            <p className="text-gray-300">Please upload a KML/KMZ, GeoJSON, or Shapefiles (.shp, .dbf, .shx, and .prj - note that these must be uploaded together) containing polygons to define an area of interest.</p>
                        )}
                    </div>
                    {warning && (
                        <p className="text-red-500">{warning}</p>
                    )}
                    {files.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-gray-400">Selected Files:</h4>
                            <ul className="text-gray-300">
                                {files.map((file) => (
                                    <li key={file.name}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className='flex justify-between gap-2'>
                        <Button onClick={() => setOpen(false)} className="mt-4 w-full bg-[#2b3a4a]">Cancel</Button>
                        <Button onClick={handleFileUpload} className="mt-4 w-full bg-[#2b3a4a]">Upload</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FileUploader