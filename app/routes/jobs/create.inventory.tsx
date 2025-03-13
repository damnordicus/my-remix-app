import { error } from "console";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { data, Form, Link, Navigate, Outlet, redirect, useActionData, useFetcher, useLoaderData, useNavigate } from "react-router";
import CheckboxGroup from "~/components/CheckboxGroup";
import { userSession } from "~/services/cookies.server";
import { getAllBrands, getAllColors, getAllFilaments, getAllMaterials, getAllUnusedMaterials, getFirstBarcodeForFilament } from "~/services/filament.server";

export const loader = async ({request}) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..")
    const materials = await getAllUnusedMaterials();
    return {materials}
}

export const action = async ({request}) => {
    try {
    const formData = await request.formData();
    const actionType = formData.get("_action");
    if(actionType === 'submit'){
        
        const brand = formData.get("brand");
        const material = formData.get("material");
        const color = formData.get("color");

        if(!brand || !material || !color){
            return  {message: 'All fields are required!', status: 400};
        }
        const barcodes = await getFirstBarcodeForFilament(brand, material, color);
        if(!barcodes){
            return {message: 'No rolls found for that selection', status: 400}
        }

        // const temp = {brand: brand, material: material, color: color, barcode: barcode?.barcode};
        // const barcodeParam = barcode;
        // const stringify = JSON.stringify(temp);
        // const results = btoa(stringify)
        // console.log(barcodeParam)
        return redirect(`../../job/create?selection=${barcodes}`);
    }
    if(actionType === 'clear'){
        
        return redirect("..");
    }
    } catch (e) {
        console.error(e);
        if (e instanceof Error)
            return data({ message: e.message }, {
                status: 404
            })

        return data({ message: 'There was an error.'}, {
            status: 500
        })
    }
}

export default function SelectFromInventory(){
    const {materials} = useLoaderData<typeof loader>();
    const materialFetcher = useFetcher();
    const colorFetcher = useFetcher();
    const brandFetcher = useFetcher();

    const [showColor, setShowColor] = useState(false);
    const [showBrand, setShowBrand] = useState(false);
    const [colorOptions, setColorOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const actionData = useActionData<{message?: string}>();

    function handleChange(e) {
        //e.target.name
        console.log('test')
        switch(e.target.name){
            case 'material' :
                if(e.target.value !== ''){
                    setSelectedMaterial(e.target.value);
                    materialFetcher.load(`/api/materials?material=${e.target.value}`) 
                }
                break;
            case 'color':
                if(e.target.value !== ''){
                  colorFetcher.load(`/api/colors?color=${e.target.value}&material=${selectedMaterial}`)  
                }
                break;
            default :
                break;
        }

    }

    useEffect(() => {
        if(materialFetcher.data && materialFetcher.state === "idle"){
            console.log('test', materialFetcher.data)
            setColorOptions(materialFetcher.data.result);
            setShowColor(true);
        } 
        if(colorFetcher.data && colorFetcher.state === "idle"){
            console.log('color: ',colorFetcher.data)
            setBrandOptions(colorFetcher.data.result);
            setShowBrand(true);
        }

    },[ materialFetcher.data, materialFetcher.state, colorFetcher.data, colorFetcher.state])

    console.log('actionData: ', actionData)

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs bg-black/30">
            <div className={`w-[400px] bg-slate-600 rounded-2xl shadow-xl py-2 relative border-2 border-slate-300 `}>
                <h1 className="text-center text-2xl text-amber-500 pb-2">
                    Select A Roll
                </h1>
                <Form method="POST">
                <div className="flex justify-around mb-2">
                <label htmlFor="material" className="pl-4 pr-2 self-center text-xl">Material: </label>
                <select name="material" className="w-full bg-slate-800/60 text-white mr-4 border border-slate-400 rounded-xl py-2 pl-2 text-xl self-center" onChange={handleChange}>
                    <option key={0} value={''}></option>
                    {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                    ))}
                </select>
                </div>
                {showColor && <div className="flex justify-around mb-2">
                <label htmlFor="color" className="pl-4 pr-2 self-cente text-xl">Colors: </label>
                <select name="color" className="w-full bg-slate-800/60 text-white mr-4 border border-slate-400 rounded-xl py-2 text-xl pl-2 self-center" onChange={handleChange}>
                <option key={0} value={''}></option>
                    {colorOptions.map((color, index) => (
                        <option key={index} value={color}>{color}</option>
                    ))}
                </select>
                </div>}
                {showBrand && <div className="flex justify-around">
                <label htmlFor="brand" className="pl-4 pr-2 self-center text-xl">Brands: </label>
                <select name="brand" className="w-full bg-slate-800/60 text-white mr-4 border border-slate-400 rounded-xl py-2 text-xl pl-2 self-center" onChange={handleChange}>
                <option key={0} value={''}></option>
                    {brandOptions.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
                </div>}

                {actionData?.message && <p className="text-center text-red-500">{actionData.message}</p>}
                <div className="flex justify-center gap-4 mt-4 items-center">
                    {/* <Link to={''}className="left-4 text-sm italic underline">Request a filament!</Link> */}
                    <button type="submit" name="_action" value="submit" className="bg-amber-600 px-4 py-2 rounded-xl border-2 border-amber-400 text-white text-xl">Select</button>
                    <button type="submit" name="_action" value="clear" className="bg-red-500/80 px-4 py-2 rounded-xl border-2 border-red-700/80 text-white text-xl">Cancel</button>
                </div>
                </Form>
            </div>
            <Outlet />
        </div>
    );
}