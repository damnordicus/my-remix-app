import React, { useState } from "react";
import { Form, Link, Navigate, Outlet, redirect, useFetcher, useLoaderData, useNavigate } from "react-router";
import CheckboxGroup from "~/components/CheckboxGroup";
import { getAllBrands, getAllColors, getAllFilaments, getAllMaterials, getFirstBarcodeForFilament } from "~/services/filament.server";

export const loader = async ({request}) => {
    // const brands = await getAllBrands();
    // const colors = await getAllColors();
    const materials = await getAllMaterials();
    // const filaments = await getAllFilaments();

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
        const barcodes = await getFirstBarcodeForFilament(brand, material, color);
        let barcode;

        if(barcodes?.rolls && barcodes.rolls.length > 0){
            barcode = barcodes.rolls[0].barcode;
        }else{
            return {message: 'No rolls found for that selection', status: 400}
        }

        // const temp = {brand: brand, material: material, color: color, barcode: barcode?.barcode};
        const barcodeParam = barcode;
        // const stringify = JSON.stringify(temp);
        // const results = btoa(stringify)
        console.log(barcodeParam)
        return redirect(`../../job/create?selection=${barcodeParam}`);
    }

}

export default function SelectFromInventory(){
    const {brands, colors, materials, filaments} = useLoaderData<typeof loader>();
    const fetcher = useFetcher();

    function handleChange(e) {
        //e.target.name
        switch(e.target.name){
            case 'materials' :
                console.log('materials')
                fetcher.load(`materials?material=${e.target.value}`)
                break;
            case 'colors':
                console.log('colors')
                break;
            case 'brands':
                console.log('brands')
                break;
            default :
                break;
        }

    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className={`w-[400px] bg-slate-600 backdrop-blur-xs rounded-2xl shadow-xl py-2 relative border-2 border-slate-300 `}>
                <h1 className="text-center text-2xl text-amber-500 pb-2">
                    Select A Roll
                </h1>
                <Form method="POST">
                <div className="flex justify-around">
                <label htmlFor="materials" className="px-4">Material: </label>
                <select name="materials" className="w-full bg-slate-800/60 text-white mr-4" onChange={handleChange}>
                    {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                    ))}
                </select>
                </div>
                {/* <div className="flex justify-around">
                <label htmlFor="colors" className="px-4">Colors: </label>
                <select name="colors" className="w-full bg-slate-800/60 text-white mr-4" onChange={handleChange}>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
                </div> */}

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