import React from "react";

export default function CheckboxGroup ({items, label, setSelected }:{items: string[], label: string, setSelected: React.Dispatch<React.SetStateAction<string>>}) {

    function handleChange(e){
        if(e.target.checked){
           setSelected(e.target.value) 
        }else{
            setSelected('');
        }
        
    };

    return (
        <div className="flex flex-col">
            <label className="text-lg mb-1">{label}:</label>
                {items.map(x => (
                    <label key={x}>
                    <input type="checkbox" name="brand" value={x} className="mr-2" onChange={(e) => handleChange(e)}/>
                    {x}
                    </label>
                ))}
        </div>
    );
}