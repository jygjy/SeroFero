import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function CommunityHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800">Community Hub</h2>
      <Link href="/add-location">
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
          <FaPlus className="mr-2" /> Add Location
        </button>
      </Link>
    </div>
  );
}
