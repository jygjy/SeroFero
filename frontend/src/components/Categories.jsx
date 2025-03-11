// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css"; // Swiper styles
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Navigation, Pagination } from "swiper/modules";
// import Link from "next/link";

// const categories = [
//   { name: "Maldives", img: "maldives.jpg" },
//   { name: "Philippines", img: "maldives.jpg" },
//   { name: "Japan", img: "maldives.jpg" },
//   { name: "Nepal", img: "maldives.jpg" },
// ];

// export default function Categories() {
//     return (
//       <section className="container mx-auto mt-16 px-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-dark">Categories</h2>
//           <Link href="/categories" className="text-primary hover:underline">
//             View All
//           </Link>
//         </div>
  
//         {/* Swiper Slider */}
//         <Swiper
//           modules={[Navigation, Pagination]}
//           spaceBetween={20}
//           slidesPerView={2} // Adjust based on screen size
//           navigation // Adds prev/next buttons
//           pagination={{ clickable: true }}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             768: { slidesPerView: 3 },
//             1024: { slidesPerView: 4 },
//           }}
//           className="w-full"
//         >
//           {categories.map((category, index) => (
//             <SwiperSlide key={index} className="rounded-2xl overflow-hidden shadow-md">
//               <div className="relative w-full h-48">
//                 <img
//                   src={category.img}
//                   alt={category.name}
//                   className="w-full h-full object-cover rounded-2xl"
//                 />
//                 <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
//                   {category.name}
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </section>
//     );
//   }
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

const categories = [
  { name: "Adventure", img: "/maldives.jpg" },
  { name: "Hiking", img: "/maldives.jpg" },
  { name: "Camping", img: "/maldives.jpg" },

  { name: "Wildlife", img: "/maldives.jpg" },
  // { name: "Snow & Skiing", img: "/maldives.jpg" },
  { name: "Food & Culture", img: "/maldives.jpg" },
];

export default function Categories() {
  return (
    <section className="container mx-auto mt-16 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Explore Categories</h2>
        <Link href="/categories" className="text-blue-500 hover:underline">
          View All
        </Link>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={category.img}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-lg font-semibold text-center py-3">
                {category.name}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
