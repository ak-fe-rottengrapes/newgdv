'use client';
import { Sidebar } from '@/components/shared/Sidebar';
import MapComponent from '../shared/Map';

export const UserLayout = ({ children }) => {
  return (
    <div className="relative h-screen flex">
      <div className="absolute md:relative z-50">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex flex-col md:flex-row pt-16 md:pt-0">
          <div className="w-full md:w-[70%] h-[50vh] md:h-full relative">
            <MapComponent />
          </div>
          <div className="w-full md:w-[30%] p-4 overflow-auto bg-[#212B35] text-white">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}; 