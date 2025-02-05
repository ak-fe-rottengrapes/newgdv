'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Button } from '../ui/button'
import { useTool } from '@/app/context/ToolContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createOrder } from '../services/order/api'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { MapContext } from '@/app/context/MapContext'
import VectorLayer from 'ol/layer/Vector'
import { FadeLoader, PulseLoader } from 'react-spinners'


const AddToCart = () => {
  const { data: session } = useSession()
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
    setOperaorGeoData,
    selectedSatellitesDetails,
    setSelectedSatellitesDetails,
    addToCartId, setAddToCartId } = useTool();
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateUniqueOrderId = (userId) => {
      const unixTimestamp = Math.floor(Date.now() / 1000);
      const uniqueOrderId = `${userId}-${unixTimestamp}`;
      return uniqueOrderId;

    };
    const orderIdName = generateUniqueOrderId(session?.user?.user_id);
    setName(orderIdName);
    // setActiveTool(null);
  }, []);


  const { map, setMap } = useContext(MapContext)
  const router = useRouter()

  const handleRemove = (satellite) => {
    const newSelectedSatellitesDetails = { ...selectedSatellitesDetails }
    const satelliteName = satellite.satelliteName
    const satelliteIndex = newSelectedSatellitesDetails[satelliteName].findIndex((sat) => sat.id === satellite.id)
    newSelectedSatellitesDetails[satelliteName].splice(satelliteIndex, 1)
    setSelectedSatellitesDetails(newSelectedSatellitesDetails)

    const newSatelliteData = { ...satellite_data };
    // const satelliteName = satellite.satelliteName;
    const satelliteInde = newSatelliteData[satelliteName].findIndex(
        (sat) => sat.id === satellite.id
    );
    newSatelliteData[satelliteName].splice(satelliteInde, 1);
    setSatelliteData(newSatelliteData);
console.log(satellite.id)
setAddToCartId((prev) => prev.filter((id) => id !== String(satellite.id)));

  }
  console.log(addToCartId)

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let sum = 0;

      // Loop through each satellite type (JILIN, MAXAR etc)
      Object.values(selectedSatellitesDetails).forEach(satelliteArray => {
        // Sum up prices for each satellite array
        satelliteArray.forEach(item => {
          sum += item.price;
        });
      });

      setTotalPrice(Number(sum.toFixed(2)));
    };

    calculateTotalPrice();
  }, [selectedSatellitesDetails]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = {
        name: name,
        order_type: order_type,
        date_from: date_from,
        date_to: date_to,
        operators: operators,
        resolution: resolution,
        cloud_cover_percentage: cloud_cover_percentage,
        note: note,
        imagery_type: imagery_type,
        ona_percentage: ona_percentage,
        area: area,
        satellite_data: satellite_data,
        location: location,
        total_price: totalPrice
      }
      console.log(data)
      const response = await createOrder(session?.user?.access, data)
      if (response) {
        toast({
          title: 'Success',
          description: 'Order created successfully',
          status: 'success',
          duration: 2000,
          className: 'bg-green-200',
          type: 'success'
        })
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

        console.log("err")
        setName('')
        setOrderType('')
        setDateFrom('')
        setDateTo('')
        setOperators([])
        setResolution()
        setCloudCoverPercentage(10)
        setNote('')
        setImageryType('')
        setOnaPercentage(10)
        setArea()
        setSatelliteData({
          JILIN: [],
          MAXAR: [],
        })
        setLocation()
        setSelectedSatellitesDetails({
          JILIN: [],
          MAXAR: [],
        })
        setTotalPrice(0)
        setAddToCartId([])

        router.push('/user/order')
      }
    } catch (error) {
      toast({
        title: 'Error',
        message: error.message,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`h-full flex flex-col gap-2 justify-between overflow-y-scroll rounded-lg backdrop-blur-sm font-inter`} >
      <h1 className={`text-lg p-1 border text-center font-bold bg-[#202A33] rounded-lg`} style={{ color: "rgba(255, 255, 255, 1)" }}>
        Cart
      </h1>
      <div className='flex flex-col gap-2'>
        <div className='border rounded-lg h-[calc(100vh-150px)] overflow-y-auto shadow-md p-4 bg-[#202A33] text-white'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold mb-4'>Order Summary</h2>
            <span className=' mb-4'>Total Price: ${totalPrice}</span>
          </div>
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
                        <span className="text-xs text-gray-300">Area: {satellite?.area_sq_km} km<sup>2</sup></span>
                        <span className="text-xs text-gray-300">Min.size: {satellite.min_order_size} km<sup>2</sup></span>
                      </div>

                      {/* Price & Min Order Size */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-md font-bold">${satellite.price_per_sqkm}/km<sup>2</sup></span>
                        <span className="text-md font-bold">Price: ${satellite.price}</span>
                        <button className="mt-2 bg-[#202A33] border border-gray-600 rounded-2xl p-1 text-white text-xs transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-gray-400" onClick={() => handleRemove(satellite)}>
                          Remove
                        </button>


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
        {/* <Button
          onClick={() => handleSubmit()}
          className="bg-[#2b3a4a] hover:bg-[#28455e] hover:text-white w-full"
        >
           {isLoading ?  'Checkout': <FadeLoader size={2} color="#ffffff" /> }
        </Button> */}
        <Button
      onClick={() => handleSubmit()}
      className={`w-full flex justify-center items-center ${isLoading ? 'bg-[#2b3a4a]' : 'bg-[#2b3a4a]'} 
        ${isLoading ? 'hover:bg-[#2b3a4a]' : 'hover:bg-[#28455e] hover:text-white'}
        ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
    >
      {isLoading ? (
        // 'Buying...'
        // <FadeLoader size={10} color="#ffffff" />
        <>
         <PulseLoader size={4} color="#ffffff" />
        </>
      ) : (
        'Buy'
      )}
    </Button>

      </div>
    </div>
  )
}

export default AddToCart