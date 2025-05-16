import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img3 from '../../assets/images/hero_bg2-removebg.png';
import img2 from '../../assets/images/hero_bg_2.png';
import img1 from '../../assets/images/hero_bg_3.png';
import { faSearch, faMapMarkerAlt, faArrowDown, faGraduationCap, faHandshake, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Find Your Perfect",
      highlight: "Institute",
      description: "Explore top institutes worldwide and find the one that matches your aspirations and goals.",
      buttonText: "",
      buttonIcon: null,
      bgColor: "from-[#66B3FF] to-[#0084FF]",
      image: img1,
    },
    {
      title: "Your Dream Institute",
      highlight: "Awaits You",
      description: "We help students like you get into their dream institutes with personalized guidance, resources, and support every step of the way.",
      buttonText: "Sign up as a Student",
      buttonIcon: faGraduationCap,
      bgColor: "from-[#66B3FF] to-[#0084FF]",
      image: img2,
      link: '/signup'
    },
    {
      title: "Institutes, Meet Your",
      highlight: "Ideal Students",
      description: "We connect top institutes with talented students, helping you build diverse and dynamic student bodies that drive innovation and success.",
      buttonText: "Register as an Institute",
      buttonIcon: faHandshake,
      bgColor: "from-[#66B3FF] to-[#0084FF]",
      image: img3,
      link: 'register-institute'
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 15000);

      return () => clearInterval(timer);
    }
  }, [isPaused, slides.length]);

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    setIsPaused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchExpanded(false);
    setIsPaused(false);
  };

  const handleSearchClick = () => {
    navigate('/institutes');
  };

  return (
    <main className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-screen bg-gradient-to-r ${slide.bgColor} bg-contain bg-right bg-no-repeat transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="flex flex-col md:flex-row h-full w-full pt-20 md:pt-0 relative">
            {/* Left Panel */}
            <div
              className={`h-full w-full md:w-2/3 flex flex-col justify-center items-center px-4 md:px-20 space-y-4 rounded-md animate-slide-in-left`}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800">
                {slide.title}{" "}
                <span className=" text-white p-2 rounded-lg inline-block sm:block mt-2 sm:mt-0">
                  {slide.highlight} {index === 0 && <span className="animate-blink">|</span>}
                </span>
              </h2>

              {index === 0 ? (
                <div
                  className={`space-y-4 md:space-y-6 w-full max-w-2xl transition-all duration-300 ease-in-out`}
                >
                  <p className="text-lg md:text-xl text-gray-700 text-center max-w-xl">
                    {slide.description}
                  </p>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search Institute"
                      className="w-full pl-10 pr-4 py-2 md:py-3 rounded-md border-2 border-gray-200 focus:border-[#8C52FF] focus:outline-none transition-colors"
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                    />
                  </div>
                  {isSearchExpanded && (
                    <>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <select className="w-full pl-10 pr-4 py-2 md:py-3 rounded-md border-2 border-gray-200 focus:border-[#8C52FF] focus:outline-none transition-colors appearance-none">
                          <option value="">Select Location</option>
                          <option value="lahore">Lahore</option>
                          <option value="karachi">Karachi</option>
                          <option value="islamabad">Islamabad</option>
                        </select>
                      </div>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faDollarSign}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="number"
                          placeholder="Maximum Budget"
                          className="w-full pl-10 pr-4 py-2 md:py-3 rounded-md border-2 border-gray-200 focus:border-[#8C52FF] focus:outline-none transition-colors"
                        />
                      </div>
                    </>
                  )}
                  <button 
                    className="w-full py-2 md:py-3 bg-[#1d5ec7] text-white rounded-md text-base md:text-lg font-medium hover:bg-[#306fd6] transition-colors duration-200 flex justify-center items-center"
                    onClick={handleSearchClick}
                  >
                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                    Search
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-lg md:text-xl text-gray-700 text-center max-w-xl">
                    {slide.description}
                  </p>
                  <button 
                    className="py-2 md:py-3 px-4 md:px-6 bg-[#1d5ec7] text-white rounded-md text-base md:text-lg font-medium hover:bg-[#306fd6] transition-colors duration-200 flex items-center"
                    onClick={() => navigate(slide.link)}
                  >
                    <FontAwesomeIcon icon={slide.buttonIcon} className="mr-2" />
                    {slide.buttonText}
                  </button>
                </>
              )}
            </div>

            {/* Right Panel (Image) - Hidden in Responsive */}
            <div className="hidden md:flex h-1/2 md:h-full w-full md:w-1/2 flex-col justify-center items-center relative z-10 animate-slide-in-right">
              <img
                src={slide.image || "/placeholder.svg"}
                alt={`Hero Image ${index + 1}`}
                className="w-full h-5/6 object-cover object-center md:object-right rounded-md z-0"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Slider Dots */}
      <div className="absolute bottom-16 md:bottom-20 w-full z-20">
        <ul className="flex justify-center items-center m-0 p-0">
          {slides.map((_, index) => (
            <li
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 mx-1 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              onClick={() => setCurrentSlide(index)}
            ></li>
          ))}
        </ul>
      </div>

      {/* Learn More Section with Animated Arrow */}
      <div className="absolute bottom-2 flex justify-center w-full z-20">
        <div className="text-center">
          <p className="text-base md:text-lg text-gray-700">Learn More</p>
          <div className="mt-2 animate-bounce">
            <FontAwesomeIcon icon={faArrowDown} className="text-[#1d5ec7] text-xl md:text-2xl" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;