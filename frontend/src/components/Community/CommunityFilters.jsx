import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function CommunityFilters({ locations, setFilteredLocations }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    filterLocations(e.target.value, filter);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    filterLocations(search, e.target.value);
  };

  const filterLocations = (searchTerm, category) => {
    let filtered = locations;
    if (searchTerm) {
      filtered = filtered.filter((loc) => loc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category && category !== "all") {
      filtered = filtered.filter((loc) => loc.category === category);
    }
    setFilteredLocations(filtered);
  };

  return (
    <div className="flex gap-4 mb-2">
      <div className="relative w-full">
        <FaSearch className="absolute left-3 top-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={handleSearch}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        value={filter}
        onChange={handleFilter}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Categories</option>
        <option value="Nature">Nature</option>
        <option value="Adventure">Adventure</option>
        <option value="Food">Food</option>
      </select>
    </div>
  );
}
