import { Form } from "@remix-run/react";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import Navbar from "./Navbar";
import { AddFilament } from "./AddFilament";
import Badge from "./Badge";
import SelectedItem from "~/components/$filamentId";

export default function Inventory({ filaments, brands, colors, materials }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    material: [],
    color: [],
  });
  const [filterVisible, setFilterVisible] = useState(false);

  const [list, setList] = useState(null);

  useEffect(() => {
    setList(filaments);
  }, [filaments]);

  const handleItemClick = (id) => {
    console.log("handle: ", filaments);
    const item = filaments.find((y) => y.id === id);
    console.log(item);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };
 
  function handleScan(barcode) {
    console.log("barcode: ", barcode);
    setScannedBarcode(barcode);
  }

  const filterList = () => {
    setFilterVisible(!filterVisible);
    const newList = filaments.filter((filament) => {
      const brandMatch = selectedFilters.brand.length
        ? selectedFilters.brand.includes(filament.brand)
        : true;
      const materialMatch = selectedFilters.material.length
        ? selectedFilters.material.includes(filament.material)
        : true;
      const colorMatch = selectedFilters.color.length
        ? selectedFilters.color.includes(filament.color)
        : true;
      return brandMatch && materialMatch && colorMatch;
    });
    setList(newList);
  };
  console.log("selected: ", selectedFilters);

  const isFiltered = !Object.values(selectedFilters).every(
    (arr) => arr.length > 0
  );

  const filamentList = !isFiltered ? filaments : list ?? filaments;

  return (
    <div className="">
      <div className="bg-slate-800 w-[300px] h-[35px] rounded-ee-2xl border-b-4 border-r-4 border-slate-600">
      <p className="bg-opacity-0 text-white text-xl pl-3 ">
        Filament Inventory Manager
      </p>
      </div>
      <div className="flex justify-center py-4 gap-1 ">
        <AddFilament />
        <Navbar
          setSelectedFilters={setSelectedFilters}
          filterList={filterList}
          brands={brands}
          materials={materials}
          colors={colors}
          list={selectedFilters}
          filterVisible={filterVisible}
          setFilterVisible={setFilterVisible}
        />
      </div>
      <div className="w-5/12 mx-auto border-2 border-slate-400 rounded-lg overflow-hidden drop-shadow-xl z-0">
        <div className="max-h-[800px] overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed  ">
            <thead className="sticky top-0 z-3 text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-slate-600">
              <tr className="rounded-t-lg ">
                <th scope="col" className="pl-6 py-3 w-1/4">
                  Brand
                </th>
                <th scope="col" className="text-center py-3 w-1/4">
                  Material
                </th>
                <th scope="col" className="text-center py-3 w-1/4">
                  Color
                </th>
                <th scope="col" className="text-center py-3 w-1/4">
                  Stock
                </th>
                {/* <th scope="col" className="px-6 py-3">Update</th>
            <th scope="col" className="px-6 py-3">Delete</th> */}
              </tr>
            </thead>
            <tbody className="">
              {filamentList.map((filament) => (
                <tr
                  key={filament.id}
                  className={`w-full ${
                    filament.stock_level > 9
                      ? "dark:bg-gray-800 dark:border-gray-700"
                      : filament.stock_level > 5
                      ? "bg-yellow-500 text-black"
                      : "bg-red-500 text-black"
                  } border-b border-gray-200 hover:bg-gray-600`}
                  onClick={() => handleItemClick(filament.id)}
                >
                  <td className="">
                    <p className=" text-lg pl-2">{filament.brand}</p>
                  </td>
                  <td className="text-center">
                    <p>{filament.material}</p>
                  </td>
                  <td className={`text-cente `}>
                    <p><Badge>{filament.color}</Badge></p>
                  </td>
                  <td className="text-center">
                    <p>{filament.stock_level}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <SelectedItem selectedItem={selectedItem} onClose={handleClose} />
      )}
    </div>
  );
}
