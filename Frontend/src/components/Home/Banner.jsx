import React from 'react';

const Banner = () => {
  return (
    <div className="bg-gradient-to-r to-[#5f70ce] from-[#3f6dd1] text-white py-6 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-2xl md:text-3xl lg:text-4xl font-regular mx-4">
          Explore educational opportunities with GlobalApply!
        </span>
        <span className="text-2xl md:text-3xl lg:text-4xl font-semibold mx-4">
          Find the best institutes and career counseling all in one place.
        </span>
      </div>
    </div>
  );
};

export default Banner;

