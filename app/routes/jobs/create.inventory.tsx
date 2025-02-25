import React, { useEffect, useState } from "react";
import { Form, Link, Navigate, Outlet, redirect, useFetcher, useLoaderData, useNavigate } from "react-router";
import CheckboxGroup from "~/components/CheckboxGroup";
import { getAllBrands, getAllColors, getAllFilaments, getAllMaterials, getFirstBarcodeForFilament } from "~/services/filament.server";

export const loader = async ({request}) => {
    // const brands = await getAllBrands();
    // const colors = await getAllColors();
    const materials = await getAllMaterials();
    // const filaments = await getAllFilaments();
    console.log('materials: ', materials)
    //return {brands, colors, materials, filaments};
    return {materials}
}

export const action = async ({request}) => {
    const formData = await request.formData();
    const actionType = formData.get("_action");
    if(actionType === 'submit'){
        
        const brand = formData.get("brand");
        const material = formData.get("material");
        const color = formData.get("color");
        console.log('brand: ', brand, ' material: ', material, ' color: ', color)
        const barcodes = await getFirstBarcodeForFilament(brand, material, color);
        console.log('barcode: ', barcodes)
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

    function handleChange(e) {
        //e.target.name

        switch(e.target.name){
            case 'material' :
                if(e.target.value !== ''){
                    setSelectedMaterial(e.target.value);
                    materialFetcher.load(`materials?material=${e.target.value}`) 
                }
                break;
            case 'color':
                if(e.target.value !== ''){
                  colorFetcher.load(`colors?color=${e.target.value}&material=${selectedMaterial}`)  
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className={`w-[400px] bg-slate-600 backdrop-blur-xs rounded-2xl shadow-xl py-2 relative border-2 border-slate-300 `}>
                <h1 className="text-center text-2xl text-amber-500 pb-2">
                    Select A Roll
                </h1>
                <Form method="POST">
                <div className="flex justify-around mb-2">
                <label htmlFor="material" className="pl-4 pr-2 self-center">Material: </label>
                <select name="material" className="w-full bg-slate-800/60 text-white mr-4 border border-slate-400 rounded-xl py-1 pl-2 self-center" onChange={handleChange}>
                    <option key={0} value={''}></option>
                    {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                    ))}
                </select>
                </div>
                {showColor && <div className="flex justify-around mb-2">
                <label htmlFor="color" className="pl-4 pr-2 self-center">Colors: </label>
                <select name="color" className="w-full bg-slate-800/60 text-white mr-4 border border-slate-400 rounded-xl py-1 pl-2 self-center" onChange={handleChange}>
                <option key={0} value={''}></option>
                    {colorOptions.map((color, index) => (
                        <option key={index} value={color}>{color}</option>
                    ))}
                </select>
                </div>}
                {showBrand && <div className="flex justify-around">
                <label htmlFor="brand" className="pl-4 pr-2 self-center">Brands: </label>
                <select name="brand" className="w-full bg-slate-800/60 text-white mr-4 border border-slate-400 rounded-xl py-1 pl-2 self-center" onChange={handleChange}>
                <option key={0} value={''}></option>
                    {brandOptions.map((brand, index) => (
                        <option key={index} value={brand}>{brand}</option>
                    ))}
                </select>
                </div>}

                {false && <p className="text-center text-red-500">No Rolls Found</p>}
                <div className="flex justify-around mt-4 items-center">
                    <Link to={''}className="fixed bottom-[14px] left-4 text-sm italic underline">Request a filament!</Link>
                    <button type="submit" name="_action" value="submit" className="bg-amber-600 px-2 py-1 rounded-xl border-2 border-amber-800 text-black">Select</button>
                </div>
                </Form>
            </div>
            <Outlet />
        </div>
    );
}