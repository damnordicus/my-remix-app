import React, { useState } from "react";
import { Form, Link, Navigate, redirect, useLoaderData, useNavigate } from "react-router";
import CheckboxGroup from "~/components/CheckboxGroup";
import { getAllBrands, getAllColors, getAllFilaments, getAllMaterials, getFirstBarcodeForFilament } from "~/services/filament.server";

export const loader = async ({request}) => {
    const brands = await getAllBrands(1);
    const colors = await getAllColors(1);
    const materials = await getAllMaterials(1);
    const filaments = await getAllFilaments();

    return {brands, colors, materials, filaments};
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
            barcode = barcodes.rolls[0];
        }

        const temp = {brand: brand, material: material, color: color, barcode: barcode?.barcode};
        const stringify = JSON.stringify(temp);
        const results = btoa(stringify)
        console.log(results)
        return redirect(`../../job/create?selection=${results}`);
    }

}

export default function SelectFromInventory(){
    const {brands, colors, materials, filaments} = useLoaderData<typeof loader>();

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const navigate = useNavigate();

    // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    //     event.preventDefault();
    //     const formData = new FormData(event.currentTarget);
    //     const brand = formData.get("brand");
    //     const material = formData.get("material");
    //     const color = formData.get("color");
    //    // const barcode = await getFirstBarcodeForFilament(brand, material, color);

    //     const temp = {brand: brand, material: material, color: color};
    //     const stringify = JSON.stringify(temp);
    //     const results = btoa(stringify)
    //     navigate(`../../job/create?selection=${results}`);
    // }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className={`w-[400px] bg-slate-600/70 backdrop-blur-xs rounded-2xl shadow-xl py-2 relative border-2 border-slate-300 `}>
                <h1 className="text-center text-2xl text-amber-500 pb-2">
                    Select A Roll
                </h1>
                <Form method="POST">
                <div className="flex justify-around">
                <CheckboxGroup items={brands} label={"Brands "} setSelected={setSelectedBrand}/>
                <input type="hidden" name="brand" value={selectedBrand}/>
                <CheckboxGroup items={materials} label={"Materials "} setSelected={setSelectedMaterial}/>
                <input type="hidden" name="material" value={selectedMaterial}/>
                <CheckboxGroup items={colors} label={"Colors "} setSelected={setSelectedColor}/>
                <input type="hidden" name="color" value={selectedColor}/>
                </div>
                <div className="flex justify-around mt-4 items-center">
                    <Link to={''}className="fixed bottom-[14px] left-4 text-sm italic underline">Request a filament!</Link>
                    <button type="submit" name="_action" value="submit" className="bg-amber-600 px-2 py-1 rounded-xl border-2 border-amber-800 text-black">Select</button>
                </div>
                </Form>
            </div>
        </div>
    );
}