// // import "@/styles/globals.css";

// // export default function App({ Component, pageProps }) {
// //   return <Component {...pageProps} />;
// // }


// import Link from "next/link";
// import "../styles/globals.css";

// function MyApp({ Component, pageProps }) {
//   return (
//     <div>
//       <nav className="bg-gray-800 p-4">
//         <div className="container mx-auto flex justify-between">
//           <div className="text-white font-bold">
//             <Link href="/">SeroFero</Link>
//           </div>
//           <div className="space-x-4">
//             <Link href="/register" className="text-gray-300 hover:text-white">
//               Register
//             </Link>
//             <Link href="/login" className="text-gray-300 hover:text-white">
//               Login
//             </Link>
//             <Link href="/profile" className="text-gray-300 hover:text-white">
//               Profile
//             </Link>
//             <Link href="/community" className="hover:text-primary">Community</Link>

//           </div>
//         </div>
//       </nav>
//       <Component {...pageProps} />
//     </div>
//   );
// }

// export default MyApp;

import Navbar from "@/components/Navbar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
