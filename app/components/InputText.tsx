export default function InputText({text, color, item}){
    const lowerText = text.toLowerCase();

    let colorShadow = '';
    switch(color){
        case 'red':
            colorShadow = 'border-red-500 shadow-[0px_0px_5px_1px_rgba(255,46,88,1)] placeholder-white'
            break;
        case 'blue':
            colorShadow = 'border-blue-500 shadow-[0px_0px_5px_1px_rgba(0,0,255,1)]';
            break;
        case 'green':
            colorShadow = 'border-green-300 shadow-[0px_0px_5px_1px_rgba(0,255,0,1)]';
            break;
        case 'orange':
            colorShadow = 'border-orange-300 shadow-[0px_0px_5px_1px_rgba(255,149,0,1)]';
            break;
    }

    return (
        <input
        className={`w-full p-2 border ${colorShadow} rounded-lg bg-black`}
        type="text"
        placeholder={text}
        value={item?.lowerText ?? null}
        disabled
      />
    );
}