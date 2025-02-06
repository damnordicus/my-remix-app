import { ActionFunction, json, type LoaderFunction } from "@remix-run/node";
import Inventory from "../components/inventory";
import { createFilament, deleteFilament, getAllBrands, getAllColors, getAllFilaments, getAllMaterials, updateFilamentStock } from "~/services/filament.server";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";

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

export default function Index() {
  const { filaments, brands, colors, materials } = useLoaderData<typeof loader>();
  let pic = '';
  const rand = Math.floor(Math.random() * 15);
  switch(rand){
    case 0:
      pic = 'fil1.jpg';
      break;
    case 1:
      pic = 'fil2.jpg';
      break;
    case 2:
      pic = 'fil3.jpg';
      break;
    case 3:
      pic = 'fil4.jpg';
      break;
    case 4:
      pic = 'fil5.jpg';
      break;
    case 5:
      pic = 'fil6.jpg';
      break;
    case 7:
      pic = 'fil7.jpg';
      break;
    case 8:
      pic = 'fil8.jpg';
      break;
    case 9:
      pic = 'fil9.jpg';
      break;
    case 10:
      pic = 'fil0.jpg';
      break;
    case 11:
      pic = 'fil11.jpg';
      break;
    case 12:
      pic = 'fil12.jpg';
      break;
    case 13:
      pic = 'fil13.jpg';
      break;
    case 14:
      pic = 'fil14.jpg';
      break;
  }
  
  return (
    <div className={`bg-[url('/public/fil3.jpg')] bg-cover min-h-screen `}>
      {(filaments && filaments.length > 0) ? (<Inventory filaments={filaments} brands={brands} colors={colors} materials={materials}/>):(
        <p>No filament in databse.</p>
      )}
     
    </div>
  );
}
