import { Form } from "@remix-run/react";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import Navbar from "./Navbar";
import { AddFilament } from "./AddFilament";

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
    <div>
      <p className="bg-opacity-0 text-white text-xl pl-3 ">
        Filament Inventory Manager
      </p>
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
      <div className="w-9/12 mx-auto border-2 border-slate-400 rounded-lg overflow-hidden drop-shadow-xl z">
        <div className="max-h-[800px] overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixd ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
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
            <tbody>
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
                    <p className="text-xl pl-2">{filament.brand}</p>
                  </td>
                  <td className="text-center">
                    <p>{filament.material}</p>
                  </td>
                  <td className="text-center">
                    <p>{filament.color}</p>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[400px] h-[250px] bg-slate-600 rounded-2xl shadow-lg p-6 relative border-2 border-slate-300 ">
            <p
              className="absolute top-2 right-2 cursor-pointer text-white text-xl"
              onClick={handleClose}
            >
              ✖
            </p>
            <p className="text-white font-bold">{selectedItem.brand}</p>
            <div className="flex gap-10">
              <p className="">{selectedItem.material}</p>

              <p>{selectedItem.color}</p>
            </div>

            <Form method="post" className="mt-4">
              <input type="hidden" name="id" value={selectedItem.id} />
              {/* <BarcodeScanner onScan={handleScan} />
              {scannedBarcode && (
                <p>Scanned code: {scannedBarcode}</p>
              )} */}
              <p>Current Quantity: {selectedItem.stock_level} </p>
              <input
                type="number"
                name="stock_level"
                placeholder="Increae or decrease total stock"
                className="w-full p-2 mt-1 rounded-md text-white bg-black border-2 border-amber-500 shadow-lg"
              />
              <div className="flex mt-5 justify-center gap-2">
              <button
                type="submit"
                name="_action"
                value="update"
                className=" bg-amber-500 text-amber-800 p-2 rounded-lg shadow-lg"
              >
                <ArrowPathIcon className="size-7" />
              </button>
              <button 
              type="submit"
              name="_action"
              value="delete"
              className="bg-red-500 text-red-800 p-2 rounded-lg shadow-lg">
                <TrashIcon className="size-7"/>
              </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
