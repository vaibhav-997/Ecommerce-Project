import React from 'react';



export default function Card({ image, title, details, onClick}) {

  return (
    <div className="relative h-[400px] w-[300px] rounded-md overflow-hidden">
      <img
        src={image[0]}
        alt="AirMax Pro"
        className="z-0 h-full w-full rounded-md object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-left">
        <h1 className="text-lg font-semibold text-white truncate-2-lines">
          {title}
        </h1>
        <div className="mt-2 text-sm text-gray-300 overflow-hidden h-16 mx-2">
          {details}
        </div>
        <button onClick={onClick} className="mt-2 inline-flex cursor-pointer items-center text-sm mr-3 font-semibold text-white">
          View Profile &rarr;
        </button>
        
      </div>
      
    </div>
  );
}
