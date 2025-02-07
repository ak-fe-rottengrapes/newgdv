import React from 'react'
import Image from 'next/image'
import spaceImage from '../images/Space.png'
import Astronaut from '../images/Astronaut.png'
import Time from '../images/TotalTime.png'
import Purchase from '../images/purchase.png'
import orderImagery from '../images/Imagery.png'
import image_1 from '../images/4Images_1.png'
import image_2 from '../images/4Images_2.png'
import image_3 from '../images/4Images_3.png'
import image_4 from '../images/4Images_4.png'
import moon from '../images/moon.png'
import Satallite from '../images/satallite.png'
import map from '../images/map.png'
import laptop from '../images/laptop.png'
import customer from '../images/customer.png'
import community from '../images/community.png'
import twoAstronaut from '../images/twoAstronaut.png'
import image1 from '../images/image1.png'
import image1_Desktop from '../images/image1_desktop.png'
import mobileMoon from '../images/mobileMoon.png'
import Mobile_map_order from '../images/map_order.png'
import desktop_map_order from '../images/desktop_map_order.png'
import Earth_Gif from '../images/earth.gif'

function Main() {
  return (
    <div className='p-3 mt-5 relative mx-1'>
      <div>
        <div className="">

          <Image src={image1_Desktop}
          alt='image1'
            className='hidden lg:block md:block w-full h-full'
          />
          <Image src={image1}
          alt='image2'
            className='block lg:hidden md:hidden w-full h-full'
          />


        </div>

      </div>
      <div className='text-wrap max-w-[500px] md:max-w-[450px] p-0 pb-10 lg:-mt-52 md:mt-0 sm:mt-0 font-medium '>
        <div className='mx-auto'>
          <p className='text-center lg:text-left'>
            Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.
          </p>
          <div className='flex justify-center lg:justify-start'>
            <button className='bg-[#FF000A] shadow-sm shadow-gray-800 rounded-xl px-7 text-white font-semibold p-3 my-5'>
              Get Started
            </button>
          </div>
        </div>

      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-auto-fit lg:grid-cols-[minmax(500px, 1fr)] gap-5'>
        <div className='text-2xl font-bold max-w-96'>
          <ul className="list-disc pl-10">
            <li className='pb-9'>Experience Precision: Our High-Resolution Imagery</li>
            <li className='pb-9'>Stay Ahead with Real-Time Geospatial Data</li>
            <li className='pb-9'>Personalized Insights with Custom Analytics</li>
            <li className='pb-9'>Effortless Use: Our Intuitive Interface</li>
          </ul>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-auto-fit lg:grid-cols-[minmax(300px, 1fr)] gap-5">

          <div className="w-full text-center md:text-left mx-auto md:mx-0">
            <Image
              src={image_1}
              width={70}
              height={70}
              alt='High-Resolution Imagery'
              className='mx-auto md:mx-0'
            />
            <h2 className='font-bold py-2'>High-Resolution Imagery</h2>
            <p className='text-wrap'>
              Our service provides detailed satellite images with high resolution, ensuring that users receive clear and precise visual data. This level of detail is crucial for applications such as land surveying, urban planning, and environmental monitoring, where accuracy is paramount.
            </p>
          </div>
          <div className="w-full text-center md:text-left mx-auto md:mx-0">
            <Image
              src={image_2}
              width={70}
              height={70}
              alt='Real-Time Data Access'
              className='mx-auto md:mx-0'
            />
            <h2 className='font-bold py-2'>Real-Time Data Access</h2>
            <p className='text-wrap'>
              Users can access the most current geospatial information, enabling timely and informed decision-making. This feature is especially beneficial for emergency response teams, agriculture professionals monitoring crop health, and urban planners assessing ongoing construction projects.
            </p>
          </div>

          <div className='w-full text-center md:text-left mx-auto md:mx-0'>
            <Image
              src={image_3}
              width={70}
              height={70}
              alt='User- Friendly Interface'
              className='mx-auto md:mx-0'
            />
            <h2 className='font-bold py-2'>User-Friendly Interface</h2>
            <p className='text-wrap'>
              The intuitive design of our platform ensures that users of all technical skill levels can easily navigate and utilize the available tools. This accessibility reduces the learning curve, allowing users to quickly harness the power of geospatial data without needing extensive training or technical support.
            </p>
          </div>

          <div className='w-full text-center md:text-left mx-auto md:mx-0'>
            <Image
              src={image_4}
              width={70}
              height={70}
              alt='Custom Analytics'
              className='mx-auto md:mx-0'
            />
            <h2 className='font-bold py-2'>Custom Analytics</h2>
            <p className='text-wrap'>
              Our platform offers tailored geospatial analysis to meet the specific needs of different industries. Users can generate custom reports, visualize data trends, and derive insights that are directly applicable to their unique requirements, whether for environmental studies or infrastructure development.
            </p>
          </div>
        </div>

      </div>
      <div className='mt-10 relative hidden lg:block md:block'>
        <div className=''>
          <Image
            src={moon}
            alt='moon'
          />
          <span className='absolute w-[70%]
           top-0 text-white font-extrabold text-5xl ' style={{
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>We are committed to making space science accessible to all. Explore our educational resources, including</span>
        </div>
        <div className='w-full flex absolute justify-around' style={{ top: '100%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className='flex flex-col rounded-xl bg-white h-[315px] w-[300px] text-sm shadow-xl overflow-y-hidden p-9 bottom-2 '>
            <span className='text-3xl text-[#FF000A] font-bold'>01.</span>
            <span className='text-xl font-bold pb-2'>Comprehensive Geospatial Services</span>
            <span className=''>SATPALDA offers a wide range of satellite imagery and geospatial services, including high-resolution imagery, real-time data access, and custom geospatial analytics tailored to various industries.</span>
          </div>
          <div className='flex flex-col rounded-xl bg-white h-[315px] w-[300px] text-sm shadow-xl overflow-y-hidden p-9 bottom-2 '>
            <span className='text-3xl text-[#FF000A] font-bold'>02.</span>
            <span className='text-xl font-bold pb-2'>Industry Applications</span>
            <span className=''>They serve multiple sectors such as agriculture, urban planning, defense, environmental monitoring, and disaster management, providing precise and accurate data to support critical decision-making processes.</span>
          </div>
          <div className='flex flex-col rounded-xl relative bg-white h-[315px] w-[300px] text-sm shadow-xl overflow-y-hidden p-9 bottom-2 '>
            <span className='text-3xl text-[#FF000A] font-bold'>03.</span>
            <span className='text-xl font-bold pb-2'>Commitment to Quality</span>
            <span className=''>SATPALDA is ISO 9001:2015 certified, ensuring high-quality standards, timely execution of projects, and customer satisfaction.</span>

          </div>        
        </div>


      </div>
      <div className='mt-10 w-full relative block lg:hidden md:hidden'>
        <div className=''>
          <Image
            src={mobileMoon}
            alt='moon'
          />
        </div>

        <div className='mt-2'>
          <div className='flex flex-col shadow-xl p-2 rounded-md'>
            <span className='text-3xl text-[#FF000A] font-bold'>01.</span>
            <span className='text-lg font-bold pb-2'>Comprehensive Geospatial Services</span>
            <span className=''>SATPALDA offers a wide range of satellite imagery and geospatial services, including high-resolution imagery, real-time data access, and custom geospatial analytics tailored to various industries.</span>
          </div>
          <div className='flex flex-col shadow-xl p-2 rounded-md'>
            <span className='text-3xl text-[#FF000A] font-bold'>02.</span>
            <span className='text-lg font-bold pb-2'>Industry Applications</span>
            <span className=''>They serve multiple sectors such as agriculture, urban planning, defense, environmental monitoring, and disaster management, providing precise and accurate data to support critical decision-making processes.</span>
          </div>
          <div className='flex flex-col shadow-xl p-2 rounded-md'>
            <span className='text-3xl text-[#FF000A] font-bold'>03.</span>
            <span className='text-lg font-bold pb-2'>Commitment to Quality</span>
            <span className=''>SATPALDA is ISO 9001:2015 certified, ensuring high-quality standards, timely execution of projects, and customer satisfaction.</span>
          </div>
        </div>
      </div>

      <div className='mt-2 -mx-6 '>        
        <Image
          src={desktop_map_order}
          alt='desktop map'
          className='hidden lg:block '
        />
        <Image
          src={Mobile_map_order}
          alt='mobile map'
          className='block lg:hidden'
        />
      </div>
      
      <div className=''>
        <div className='text-center p-2'>
          <span className='font-bold text-3xl '>Our Partners</span>
        </div>
        <div>
          <Image
            src={customer}
            alt='our coustomers'
          />
        </div>
      </div>

      <div className='my-10 relative w-full h-80 hidden lg:block'>
        <Image
          src={Earth_Gif}
          alt='community '
          className='object-cover w-full h-full rounded-3xl'
        />
       
        <Image
          src={twoAstronaut}
          alt='Astronaut'
          className=' w-[45%] object-cover absolute  right-0 bottom-0'
        />
        <div className='absolute top-20 left-10 '>
          <form className='flex flex-col'>
            <span className='text-white font-bold text-5xl'>Join our community</span>
            <span className='text-white font-extralight my-4 w-3/5'>Subscribe to our newsletter and stay updated about our services, products, and achievements.</span>

            <div className='flex items-center'>
              <input
                type='text'
                placeholder='Enter your email'
                className='p-4 w-full h-16 rounded-2xl'

              />
              <div>
                <button className='bg-[#A9C2CB] m-3 p-5 rounded-2xl text-white'>Subscribe</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='my-10 relative w-full h-60 block lg:hidden'>
        <Image
          src={Earth_Gif}
          alt='community '
          className='object-cover w-full h-full rounded-3xl'
        />
       
        <Image
          src={twoAstronaut}
          alt='Astronaut'
          className=' w-[60%] object-cover absolute  -right-6 bottom-0'
        />
        <div className='absolute top-5 left-5 '>
          <form className='flex flex-col'>
            <span className='text-white font-bold text-xl'>Join our community</span>
            <span className='text-white font-extralight text-sm my-4 w-3/5'>Subscribe to our newsletter and stay updated about our services, products, and achievements.</span>

            <div className='flex items-start flex-col '>
              <input
                type='text'
                placeholder='Enter your email'
                className='p-1 w-3/5 px-2 rounded-lg'

              />
              <div>
                <button className='bg-[#FF000A] text-md my-2  w-28 p-1 rounded-lg text-white'>Subscribe</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Main



