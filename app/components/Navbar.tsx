import React, { RefCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const Navbar = ({setSelectedFilters, filterList, brands, materials, colors, list, filterVisible, setFilterVisible}: {setSelectedFilters: any, filterList: any, brands: string[], materials: string[], colors: string[], list: string[], filterVisible: boolean, setFilterVisible: any}) => {
  const [searchParams] = useSearchParams();
  let localBrandFilter: string[] = [];
  let localColorFilter: string[] = [];
  let localMaterialFilter: string[] = [];
  

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        if(!updatedFilters[name].includes(value)){
            updatedFilters[name] = [...updatedFilters[name], value];
        }
        //add name ("brand") = value ("hatchbox") to url
        
      } else {
        updatedFilters[name] = updatedFilters[name].filter((v) => v !== value);
      }
      return updatedFilters;
    });
  };

  useEffect(() => {
    searchParams.getAll("brand").forEach((brand) => localBrandFilter.push(brand));
    searchParams.getAll("material").forEach((material) => localMaterialFilter.push(material));
    searchParams.getAll("color").forEach((color) => localColorFilter.push(color));

  },[searchParams])

   return (
    
    <nav className="navbar relative">
      <button
        onClick={() => setFilterVisible((prev) => !prev)}
        className="bg-amber-600 text-white p-1 pr-3 pl-3 rounded-xl border border-amber-400 drop-shadow-lg shadow-inner shadow-amber-200/40 hover:bg-amber-400 "
      >
        Filter
      </button>
      {filterVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
        <div className="p-4 w-[420px] bg-slate-500 shadow-lg rounded-xl border z-30">
          <div className="flex justify-between">
          <div className=" mb-4">
            <h3 className="font-bold text-lg">Brand</h3>
            <div className="flex flex-col">
              {brands.map((brand) => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    name="brand"
                    value={brand}
                    onChange={handleFilterChange}
                    className="mr-2"
                    checked={localBrandFilter.includes(brand) ? true : list?.brand?.includes(brand) ?? false}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg">Material</h3>
            <div className="flex flex-col">
              {materials.map((material) => (
                <label key={material}>
                  <input
                    type="checkbox"
                    name="material"
                    value={material}
                    onChange={handleFilterChange}
                    className="mr-2"
                    checked={localMaterialFilter.includes(material) ? true : list?.material?.includes(material) ?? false}
                  />
                  {material}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg">Color</h3>
            <div className="flex flex-col">
              {colors.map((color) => (
                <label key={color}>
                  <input
                    type="checkbox"
                    name="color"
                    value={color}
                    onChange={handleFilterChange}
                    className="mr-2"
                    checked={localColorFilter.includes(color) ? true : list?.color?.includes(color) ?? false}
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>
          </div>
          <div className="w-full text-center ">
          <button
            type="button"
            onClick={filterList}
            className="bg-amber-500 text-white py-2 px-4 rounded-xl shadow-xl border-2 border-amber-600"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={() => setFilterVisible(false)}
            className="bg-red-500 text-white py-2 px-4 ml-2 rounded-xl shadow-xl border-2 border-red-600"
          >
            Cancel
          </button>
          </div>
          
        </div>
        </div>
      )}
    </nav>
    
  );
};

export default Navbar;
