import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search courses, documents, activities..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
          transition-all duration-200 bg-white shadow-sm"
        />
        <FaSearch 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={16}
        />
      </div>
    </div>
  );
};

export default SearchBar;