export default function NoFilament(){
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className={`w-[400px] bg-slate-600/70 backdrop-blur-xs rounded-2xl shadow-xl py-2 relative border-2 border-slate-300 `}>
             <p>No Filament Found</p>
            </div>
        </div>
    );
}