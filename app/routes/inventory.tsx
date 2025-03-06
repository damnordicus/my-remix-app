import { data, Form, Link, LoaderFunctionArgs, Outlet, redirect, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import Navbar from "../components/Navbar";
import { AddFilament } from "./inventory/inventory.create";
import Badge from "../components/Badge";
import SelectedItem from "~/routes/inventory/inventory.$itemId";
import { ActionFunctionArgs } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { getAllFilaments, getAllBrands, getAllColors, getAllMaterials, createFilament, updateFilamentStock, deleteFilament, addRollToFilament, createNewRoll } from "~/services/filament.server";
import { userSession } from "~/services/cookies.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const session = (await userSession.parse(request.headers.get("Cookie"))) || {};
  // if(!session.username) return redirect("..")
  // const searchParams = new URL(request.url).searchParams;
  // const brandFilter = searchParams.getAll("brand");
  // const colorFilter = searchParams.getAll("color");
  // const materialFilter = searchParams.getAll("material");

  // console.log('filter', filter)

  const filaments = await getAllFilaments();
  const brands = await getAllBrands();
  const colors = await getAllColors();
  const materials = await getAllMaterials();
  
  return {filaments, brands, colors, materials, user: session.username, admin: session.admin || false }
};

export const action = async ({ request }: ActionFunctionArgs) => {
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

  if(actionType === "submit") {
    const id = formData.get("id") as unknown as number;
    const option = formData.get("option") as string;
    const weight = formData.get("weight") as unknown as number;
    const price = formData.get("price") as unknown as number;
    if(option === 'add'){
      console.log('im here')
       const newId = uuidv4();
       const addToFilament = await addRollToFilament(id)
       const addNewRoll = await createNewRoll(newId, weight, price, id);

      return fetch(`/qr/${newId}.svg`);
    }
   
  }

  // if (actionType === "update") {
      
  //   const id = parseInt(formData.get("id") as string, 10);
  //   const option = formData.get("option") as string;
  //   const barcode = formData.get("barcode") as string;
  //   if(option === 'discard'){
  //      return await deleteFilament(barcode, id);
  //   }
  //   if(option === 'add'){
  //      return await updateFilamentStock(barcode, id);
  //   }
  //   //const stock_level = parseInt(formData.get("stock_level") as string, 10);
    
  // }

  if (actionType === "delete") {
    console.log('test: ')
    const id = formData.get("id");
    return await deleteFilament(+id);
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function Inventory() {
  const {filaments, brands, colors, materials, user, admin} = useLoaderData<typeof loader>();
  const [search, setSearch] = useSearchParams();

  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<{brand: string[]; material: string[]; color: string[];}>({
    brand: [],
    material: [],
    color: [],
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const searchParams = new URLSearchParams();
  const [list, setList] = useState(null);
  const WARNING_AMOUNT = 5;
  const CRITICAL_AMOUNT = 2;

  const brandFilter = search.getAll("brand");
  const materialFilter = search.getAll("material");
  const colorFilter = search.getAll("color");


  const filteredFilaments = filaments.filter((filament) => {
    const brandMatch = brandFilter.length ? brandFilter.includes(filament.brand) : true;
    const materialMatch = materialFilter.length ? materialFilter.includes(filament.material) : true;
    const colorMatch = colorFilter.length ? colorFilter.includes(filament.color) : true;
    return brandMatch && materialMatch && colorMatch;
  })


  useEffect(() => {
    setList(filaments);
  }, [filaments]);

  const handleItemClick = (id: number) => {
    console.log('params?: ', search.toString())
    navigate(`/inventory/${id}?${search.toString()}`);
  };

  const filterList = useCallback(() => {
    setFilterVisible(false);

    

    selectedFilters.brand.forEach((brand) => searchParams.append("brand", brand));
    selectedFilters.material.forEach((material) => searchParams.append("material", material));
    selectedFilters.color.forEach((color) => searchParams.append("color", color));
    setSearch(searchParams);

    // const newList = filaments.filter((filament) => {
    //   const brandMatch = selectedFilters.brand.length
    //     ? selectedFilters.brand.includes(filament.brand)
    //     : true;
    //   const materialMatch = selectedFilters.material.length
    //     ? selectedFilters.material.includes(filament.material)
    //     : true;
    //   const colorMatch = selectedFilters.color.length
    //     ? selectedFilters.color.includes(filament.color)
    //     : true;
    //   return brandMatch && materialMatch && colorMatch;
    // });
    // console.log('newList: ', newList)
    // setList(newList);
  }, [selectedFilters, setSearch]);

  const isFiltered = !Object.values(selectedFilters).every(
    (arr) => arr.length > 0
  );

  const filamentList = filteredFilaments;

  return (
    <div className="" style={{alignSelf: "start"}}>
      <div className="flex justify-center py-4 gap-1 ">
        {admin && <Link to="create" className="bg-amber-600 text-white p-1 pr-3 pl-3 rounded-xl border border-amber-400 drop-shadow-lg shadow-inner shadow-amber-200/40 hover:bg-amber-400">Create New</Link>}
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
      <div className=" mx-8 max-h-[700px] border-2 border-slate-400 rounded-lg overflow-y-scroll drop-shadow-xl z-0">
        <div className="overflow-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed ">
            <thead className="sticky top-0 z-3 text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-slate-600">
              <tr className="rounded-t-lg ">
                <th scope="col" className={`text-center pl-6 py-3 ${admin ? 'w-1/5': 'w-1/4'}`}>
                  Brand
                </th>
                <th scope="col" className={`text-center py-3 ${admin ? 'w-1/5': 'w-1/4'}`}>
                  Material
                </th>
                <th scope="col" className={`text-center py-3 ${admin ? 'w-1/5': 'w-1/4'}`}>
                  Color
                </th>
                <th scope="col" className={`text-center py-3 ${admin ? 'w-1/5': 'w-1/4'}`}>
                  Stock
                </th>
                {/* <th scope="col" className="px-6 py-3">Update</th> */}
                {admin && <th scope="col" className="text-center py-3 w-1/12">Delete</th>}
              </tr>
            </thead>
            <tbody className="">
              {filamentList.map((filament) => (
                <tr
                  key={filament.id}
                  className={`w-full ${
                    filament._count.rolls > WARNING_AMOUNT
                      ? "dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-600"
                      : filament._count.rolls > CRITICAL_AMOUNT
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-red-400 text-black hover:bg-red-300"
                  } border-b border-gray-200 `}
                  onClick={() => handleItemClick(filament.id)}
                >
                  <td className="text-center">
                    <p className=" text-lg pl-2">{filament.brand}</p>
                  </td>
                  <td className="text-center">
                    <p>{filament.material}</p>
                  </td>
                  <td className={`flex justify-center`}>
                    <Badge>{filament.color}</Badge>
                  </td>
                  <td className="text-center">
                    <p>{filament._count.rolls }</p>
                  </td>
                  {admin && <td className="flex justify-center">
                    <Form method="post">
                      <input type="hidden" name="id" value={filament.id}/>
                      <button name="_action" value="delete"><TrashIcon className="size-6"/></button>
                    </Form>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
