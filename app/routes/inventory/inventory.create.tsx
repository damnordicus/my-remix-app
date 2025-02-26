import { XCircleIcon } from "@heroicons/react/24/outline";
import { Form, redirect, useNavigate, useNavigation } from "react-router";
import { useEffect, useState } from "react";
import { createFilament } from "~/services/filament.server";

export const action = async({ request }) => {
    const formData = await request.formData();
    const action = formData.get("_action");
    if(action === 'create'){
      const brand = formData.get("brand");
      const material = formData.get("material");
      const color = formData.get("color");
      const diameter = formData.get("diameter"); 
      await createFilament({brand, material, color, diameter});
      return redirect("..")
    }
}

export default function AddFilament () {
    //const [addVisible, setAddVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const navigation = useNavigation();
    const inputClass = 'w-5/6 p-2 border-2 rounded-md border-orange-500 bg-slate-800 shadow-md shadow-gray-700';
    const materialTypes: string[] = ['PLA', 'PLA+', 'PETG', 'TPU', 'ABS', 'NYLON']
    const FILAMENT_COLORS: string[] = [ "", "Add Color",
      "BLACK", "WHITE", "GRAY", "SILVER", "TRANSPARENT",
      "RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "PURPLE", "PINK",
      "BROWN", "BEIGE", "TAN", "GOLD", "COPPER", "BRONZE",
      "TEAL", "CYAN", "MAGENTA", "LAVENDER", "MAROON", "BURGUNDY",
      "LIME", "MINT", "AQUA", "NAVY", "OLIVE", "CHARCOAL",
      "CHAMPAGNE", "IVORY", "PEACH", "CORAL", "AMBER",
      "NEON GREEN", "NEON ORANGE", "NEON PINK", "NEON YELLOW",
      "GLOW-IN-THE-DARK", "MULTICOLOR", "RAINBOW"
    ];
    const navigate = useNavigate();

    
    // useEffect(() => {
    //     if(navigation.state === 'idle'){
    //         setAddVisible(false);
    //     } 

    // },[navigation.state]);

    const toggleView = () => {
        setSelectedColor('');
        navigate("..");
    };

    const handleChange = (e) => {
      setSelectedColor(e.target.value);
    };

    return(
        <>
      
       <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
       <div className="flex-col mt-2  bg-slate-500/60 backdrop-blur-sm w-[350px] rounded-2xl shadow-lg border-2 border-slate-300">
        <div className="relative left-89 " ><XCircleIcon className="hover:cursor-pointer size-6" onClick={toggleView} /></div>
         <h2 className="flex w-full justify-center mb-4 text-white font-semibold text-lg">Add New Filament</h2>
         
         <Form method="post" className="flex flex-col items-center space-y-3">
           <input className={inputClass} type="text" name="brand" placeholder="Brand" required />
           <select className={inputClass} name="material" required >
            {materialTypes.map(x => (
              <option value={x}>{x}</option>
            ))}
            </select>
           {selectedColor !== 'Add Color' ? <select className={inputClass} name="color" onChange={(e) => handleChange(e)} required >
            {FILAMENT_COLORS.map(x => (
              <option value={x}>{x}</option>
            ))}
            </select> : <input className={inputClass} name="color" type="text" required/>}
           <input className={inputClass} type="number" name="diameter" placeholder="Diameter (mm)" step="0.01" required />
           <input type="hidden" name="purchaseDate" value={new Date(Date.now()).toISOString()} />
     
           <button type="submit" name="_action" value="create" 
             className="w-5/6 mt-4 bg-orange-500 text-white p-2 mb-4 rounded-md hover:bg-orange-600 transition" >
             Add Filament
           </button>
         </Form>
       </div>
     </div>
        
        </>
    );
}