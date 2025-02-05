'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Button } from '../ui/button'
import { useTool } from '@/app/context/ToolContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const AddToCart = () => {
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
    setOperaorGeoData,
    selectedSatellitesDetails,
    setSelectedSatellitesDetails, } = useTool();
  
    const router = useRouter()

  const handleRemove = (satellite) => {
    const newSelectedSatellitesDetails = { ...selectedSatellitesDetails }
    const satelliteName = satellite.satelliteName
    const satelliteIndex = newSelectedSatellitesDetails[satelliteName].findIndex((sat) => sat.id === satellite.id)
    newSelectedSatellitesDetails[satelliteName].splice(satelliteIndex, 1)
    setSelectedSatellitesDetails(newSelectedSatellitesDetails)
  }

  return (
    <div className={`h-full flex flex-col gap-2 justify-between overflow-y-scroll rounded-lg backdrop-blur-sm font-inter`} >
      <h1 className={`text-lg p-1 border text-center font-bold bg-[#202A33] rounded-lg`} style={{ color: "rgba(255, 255, 255, 1)" }}>
        Cart
      </h1>
      <div className='flex flex-col gap-2'>
        <div className='border rounded-lg h-[calc(100vh-150px)] overflow-y-auto shadow-md p-4 bg-[#202A33] text-white'>
          <h2 className='text-lg font-bold mb-4'>Order Summary</h2>
          <div className='space-y-2'>
            <div className='bg-[#2b3a4a] p-3 rounded-lg'>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Order Name:</span>
                <span>{name}</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Date Range:</span>
                <span>{`${date_from
                  ? new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(date_from.replace(' ', 'T')))
                  : ''} - ${date_to
                    ? new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(date_to.replace(' ', 'T')))
                    : ''}`}</span>
              </div>

              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Area:</span>
                <span>{`${area} km²`}</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Resolution:</span>
                <span>{resolution}</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Imagery Type:</span>
                <span>{imagery_type}</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Cloud Cover:</span>
                <span>{cloud_cover_percentage}%</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>ONA Percentage:</span>
                <span>{ona_percentage}%</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Operators:</span>
                <span>{operators.join(', ')}</span>
              </div>
              <div className='flex justify-between text-xs'>
                <span className='font-semibold'>Order Type:</span>
                <span>{order_type}</span>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <h3 className='text-md font-bold mb-2'>Selected Satellites:</h3>
            {selectedSatellitesDetails && Object.keys(selectedSatellitesDetails).map((satelliteName) => (
              selectedSatellitesDetails[satelliteName].map((satellite) => (
                <div key={satellite.id} className='bg-[#2b3a4a]  rounded-lg '>
                  <ul className='text-xs'>
                    <li className="bg-[#202A33] border border-gray-600 overflow-x-auto my-2 rounded-lg text-white p-2 flex items-center gap-4">
                      {/* Image Section */}
                      <div className="w-16 h-20 flex-shrink-0">
                        {satellite.jpg ? (
                          <Image
                            src={satellite.jpg}
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
                          {satellite.imagingTime
                            ? new Intl.DateTimeFormat('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            }).format(new Date(satellite.imagingTime.replace(' ', 'T')))
                            : ''}
                        </span>
                        <span className="text-xs text-gray-300">Satellite: {satellite.satelliteName}</span>
                        <span className='text-xs text-gray-300'>Cloud: {satellite.cloudPercent?.toFixed(2)}%</span>
                      </div>

                      {/* Price & Min Order Size */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-md font-bold">${satellite.price_per_sqkm}/km<sup>2</sup></span>
                        <span className="text-md font-bold">Price: ${satellite.price}</span>
                        <button className="mt-2 bg-[#202A33] border border-gray-600 rounded-2xl p-1 text-white text-xs transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400" onClick={() => handleRemove(satellite)}>
                          Remove
                        </button>

                        <span className="text-xs">Min.size: {satellite.min_order_size} km<sup>2</sup></span>
                      </div>
                    </li>
                  </ul>
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <Button
          className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
            onClick={() => router.push('/user/searchproduct')}
        >
          Go Back
        </Button>
        <Button
          className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
        >
          Checkout
        </Button>

      </div>
    </div>
  )
}

export default AddToCart