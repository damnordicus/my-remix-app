import { ReactNode } from "react";

export default function Badge({children, size}: {children: ReactNode, size?: number}) {
    let pillDetails = '';
    const BG_COLORS: string[] = ["BLACK", "WHITE", "RED","ORANGE","AMBER","YELLOW","LIME","GREEN","EMERALD","TEAL","CYAN","SKY","BLUE","INDIGO","VIOLET","PURPLE","FUCSHIA","PINK","ROSE","SLATE","GRAY","ZINC","NEUTRAL","STONE"]

    const text = String(children).toUpperCase();
   
    const foundColor = BG_COLORS.find(color => text.includes(color)) || "SLATE";

    //pillDetails = `text-${'black'} bg-${(foundColor === 'black' || foundColor === 'white') ? foundColor : `${foundColor}-400`} border-${foundColor}-300 p-1`;

    switch(foundColor){
        case 'BLACK':
            pillDetails = 'text-white bg-black border-gray-500/40 p-1';
            break;
        case 'GRAY':
            pillDetails = 'text-gray-800 bg-gray-400 border-gray-500 p-1';
            break;
        case 'BLUE':
            pillDetails = 'text-blue-800 bg-blue-400 border-blue-500 p-1';
            break;
        case 'PURPLE':
            pillDetails = 'text-purple-800 bg-purple-400 border-purple-500 p-1';
            break;
        case 'WHITE':
            pillDetails = 'text-gray-900 bg-white border-gray-300 p-1';
            break;
        case 'RED':
            pillDetails = 'text-black bg-red-500 border-red-600 p-1';
            break;
        case 'YELLOW':
            pillDetails = 'text-yellow-900 bg-yellow-200 border-yellow-300 p-1';
            break;
        case 'GREEN':
            pillDetails = 'text-green-900 bg-green-400 border-green-500 p-1';
            break;
        case 'ORANGE':
            pillDetails = 'text-orange-900 bg-orange-400 border-orange-500 p-1';
            break;
        case 'RAINBOW':
            pillDetails = 'bg-slate-800 border-slate-700 text-lg ';
            break;
        case 'PINK':
            pillDetails = 'bg-pink-500 border-pink-700 text-white p-1';
            break;
        case 'CYAN':
            pillDetails = 'bg-cyan-500 border-cyan-700 text-black p-1';
            break;
        case 'INDIGO':
            pillDetails = 'bg-indigo-500 borer-indigo-700 text-white p-1';
            break;
        default:
            pillDetails = 'bg-slate-800 border-slate-700 text-lg text-slate-300';
            break;
        
    }
    return (
        <div className={`rounded-full text-center py-1 text-sm border-4 ${size ? 'h-[25px] w-[80px]' : 'h-[35px] w-[200px]'} ${pillDetails}`}>
            {children === 'RAINBOW' ? (
                <>
                    <span className=" text-red-500">R</span>
                    <span className=" text-orange-500">A</span>
                    <span className=" text-yellow-300">I</span>
                    <span className=" text-green-500">N</span>
                    <span className=" text-blue-500">B</span>
                    <span className=" text-indigo-500">O</span>
                    <span className=" text-violet-500">W</span>
                </>
            ): !size ? children : <></>}
        
        </div>
    );
}