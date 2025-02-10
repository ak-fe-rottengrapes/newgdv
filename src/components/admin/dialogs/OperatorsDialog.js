import { use, useState } from "react"
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
import DataTable from 'react-data-table-component';
import { addAdminComment } from "@/components/services/order/api"
import { useSession } from "next-auth/react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
export function OperatorsDialog({ children, tableData }) {


    const downloadGeoJson = (imageGeo, productId) => {
        const geoJsonData = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: imageGeo,
                    properties: {
                        productId: productId,
                    },
                },
            ],
        };

        const blob = new Blob([JSON.stringify(geoJsonData)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${productId}.geojson`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadAllGeoJson = () => {
        const geoJsonData = {
            type: 'FeatureCollection',
            features: tableData.map(item => ({
                type: 'Feature',
                geometry: item.imageGeo,
                properties: {
                    productId: item.productId,
                    satelliteId: item.satelliteId,
                },
            })),
        };

        const blob = new Blob([JSON.stringify(geoJsonData)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `all_polygons.geojson`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const columns = [
        {
            name: 'Satellite ID',
            selector: row => row.satelliteId,
            sortable: true,
            cell: row => (
                <span>{row.satelliteId}</span>
            ),
        },
        {
            name: 'Product ID',
            selector: row => row.productId,
            sortable: true,
            width: '200px',
            cell: row => (
                <span>{row.productId}</span>

            ),
        },
        {
            name: 'Download File',
            cell: row => (
                <button className="bg-green-600 p-2 text-white rounded-md"
                    size="sm"
                    onClick={() => downloadGeoJson(row.imageGeo, row.productId)}
                >
                    Download
                </button>
            ),
            width: '150px',
            sortable: false,
        },

    ];



    const customStyles = {
        table: {
          style: {
            backgroundColor: '#1F2937', // bg-gray-800
            color: '#F3F4F6', // text-gray-100
          },
        },
        rows: {
          style: {
            backgroundColor: '#1F2937', // bg-gray-800
            color: '#F3F4F6', // text-gray-100
            '&:hover': {
              backgroundColor: '#374151', // bg-gray-700
            },
          },
        },
        headRow: {
          style: {
            backgroundColor: '#111827', // bg-gray-900
            color: '#F3F4F6', // text-gray-100
          },
        },
        headCells: {
          style: {
            color: '#F3F4F6', // text-gray-100
            fontSize: '0.875rem',
            fontWeight: '600',
          },
        },
        cells: {
          style: {
            color: '#F3F4F6', // text-gray-100
          },
        },
        pagination: {
          style: {
            backgroundColor: '#1F2937', // bg-gray-800
            color: '#F3F4F6', // text-gray-100
          },
          pageButtonsStyle: {
            color: '#F3F4F6', // text-gray-100
            fill: '#F3F4F6', // text-gray-100
          },
        },
      };



    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-100">Operator Data</DialogTitle>
                </DialogHeader>
                <button
                    className="bg-green-600 w-fit ms-auto text-sm p-1 text-white rounded-md"
                    onClick={downloadAllGeoJson}
                >
                    Download All
                </button>
                <DataTable
                    columns={columns}
                    data={tableData}
                    pagination
                    responsive
                    customStyles={customStyles}
                />
            </DialogContent>
        </Dialog>
    )
}