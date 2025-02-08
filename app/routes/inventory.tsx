import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import Navbar from "../components/Navbar";
import { AddFilament } from "../components/AddFilament";
import Badge from "../components/Badge";
import SelectedItem from "~/components/$filamentId";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { getAllFilaments, getAllBrands, getAllColors, getAllMaterials, createFilament, updateFilamentStock, deleteFilament } from "~/services/filament.server";

export const loader: LoaderFunction = async () => {
  const filaments = await getAllFilaments();
  const brands = await getAllBrands();
  const colors = await getAllColors();
  const materials = await getAllMaterials();
  return ({filaments, brands, colors, materials});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "create") {
    const brand = formData.get("brand") as string;
    const material = formData.get("material") as string;
    const color = formData.get("color") as string;
    const diameter = parseFloat(formData.get("diameter") as string);
    const weight = parseInt(formData.get("weight_grams") as string, 10);
    const price = parseFloat(formData.get("price") as string);
    const purchase_date = formData.get("purchaseDate") as unknown as Date;
    return await createFilament(brand, material, color, diameter, weight, price, purchase_date);
  }

  if (actionType === "update") {
      
    const id = parseInt(formData.get("id") as string, 10);
    const stock_level = parseInt(formData.get("stock_level") as string, 10);

    return await updateFilamentStock(id, stock_level);
  }

  if (actionType === "delete") {
    console.log('test: ')
    const id = parseInt(formData.get("id") as string, 10);
    return await deleteFilament(id);
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function Inventory() {
  const {filaments, brands, colors, materials} = useLoaderData<typeof loader>();

  const [selectedItem, setSelectedItem] = useState(null);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    material: [],
    color: [],
  });
  const [filterVisible, setFilterVisible] = useState(false);

  const [list, setList] = useState(null);
  const WARNING_AMOUNT = 5;
  const CRITICAL_AMOUNT = 2;

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
    <div className="" style={{alignSelf: "start"}}>
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
        <div className="overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed">
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
                    filament.stock_level > WARNING_AMOUNT
                      ? "dark:bg-gray-800 dark:border-gray-700"
                      : filament.stock_level > CRITICAL_AMOUNT
                      ? "bg-yellow-400 text-black"
                      : "bg-red-400 text-black"
                  } border-b border-gray-200 hover:bg-gray-600 `}
                  onClick={() => handleItemClick(filament.id)}
                >
                  <td className="">
                    <p className=" text-lg pl-2">{filament.brand}</p>
                  </td>
                  <td className="text-center">
                    <p>{filament.material}</p>
                  </td>
                  <td className={`text-cente `}>
                    <Badge>{filament.color}</Badge>
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
