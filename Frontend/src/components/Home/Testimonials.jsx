import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const testimonials = [
  {
    id: 1,
    quote: "GlobalApply made my college application process so seamless! The virtual tours were a game changer.",
    name: "Ayesha",
    title: "Student, Pakistan",
    avatar: " https://www.shutterstock.com/image-photo/pakistani-university-student-girl-smiling-260nw-2508205879.jpg ",
  },
  {
    id: 2,
    quote: "Thanks to GlobalApply, I discovered my dream university and got the guidance I needed.",
    name: "Muhammad Abdullah",
    title: "Student, Pakistan",
    avatar: " https://img.freepik.com/free-photo/handsome-young-indian-student-man-holding-notebooks-while-standing-street_231208-2772.jpg ",
  },
  {
    id: 3,
    quote: "The recommendations feature helped me choose the best career path. Highly recommend GlobalApply!",
    name: "Ahmad Ali",
    title: "Student, Pakistan",
    avatar: " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRndpG1fuWB17L4nrupngdnucKNCZem-TQZJs3ZERZBGdj6zk9KT6CKwVTHgTVJkMmN_p4&usqp=CAU ",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  return (
    <section className="bg-gradient-to-br from-[#f6f2ff] to-[#e2deff] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What Students Say About Us
        </h2>

        <div className="relative bg-white rounded-lg shadow-xl p-8 md:p-12">
          <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-[#1d5ec7] mb-6" />
          
          <div className="text-center">
            <p className="text-xl md:text-2xl text-gray-700 mb-6">"{testimonials[current].quote}"</p>
            <div className="flex items-center justify-center mb-4">
              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-16 h-16 rounded-full border-2 border-[#1d5ec7]"
              />
            </div>
            <h3 className="text-lg font-semibold text-[#1d5ec7]">{testimonials[current].name}</h3>
            <p className="text-sm text-gray-600">{testimonials[current].title}</p>
          </div>

          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md focus:outline-none"
            onClick={prevSlide}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-[#1d5ec7]" />
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md focus:outline-none"
            onClick={nextSlide}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-[#1d5ec7]" />
          </button>
        </div>

        <div className="flex justify-center mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-1 rounded-full ${
                index === current ? "bg-[#1d5ec7]" : "bg-gray-300"
              }`}
              onClick={() => setCurrent(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

