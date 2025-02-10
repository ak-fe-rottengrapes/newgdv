import React from 'react'

function Loader() {
  return (
    <div className="flex flex-col w-full h-full">

        {[1, 2, 3,4,5].map((_, index) => (
            <div
                key={index}
                className="flex flex-col lg:flex-row shadow-lg justify-between w-full border border-gray-500 text-white my-2 p-1 rounded animate-pulse"
            >

                <div className="flex">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="ml-3">
                        <div className="w-24 h-4 bg-gray-700 rounded"></div>
                        <div className="w-16 h-3 bg-gray-700 rounded mt-2"></div>
                    </div>
                </div>


                <div className="flex flex-wrap text-white w-full my-2 lg:my-0 lg:w-2/4 justify-between">
                    <div className="inline-block w-1/4">
                        <div className="w-16 h-3 bg-gray-700 rounded"></div>
                        <div className="w-12 h-3 bg-gray-700 rounded mt-2"></div>
                    </div>
                    <div className="inline-block w-1/4">
                        <div className="w-16 h-3 bg-gray-700 rounded"></div>
                        <div className="w-12 h-3 bg-gray-700 rounded mt-2"></div>
                    </div>
                    <div className="inline-block w-1/4">
                        <div className="w-16 h-3 bg-gray-700 rounded"></div>
                        <div className="w-12 h-3 bg-gray-700 rounded mt-2"></div>
                    </div>
                </div>

                <div className="text-white">
                    <div className="w-24 h-3 bg-gray-700 rounded"></div>
                    <div className="w-20 h-8 bg-gray-700 rounded mt-3"></div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default Loader