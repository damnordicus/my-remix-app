

export default function PrintJobForm() {
    return (
         <div className="flex-col w-full">
            <label htmlFor="classification" className="flex pl-4 text-lg"> Job For: </label>
                <select name="classification"className="flex pl-4 text-lg w-11/12 mx-auto py-[2px]">
                    <option>Mission</option>
                    <option>Personal</option>
                </select>
            <label htmlFor="description" className="flex pl-4 text-lg" >Job Description: </label>
            <textarea name="description" className="flex text-lg w-11/12 mx-auto"></textarea>
            <div className="w-full text-center pt-2 mb-4">
                <button className="rounded-xl border-2 border-amber-600 bg-amber-500 px-2 py-1 text-black">Submit</button>
            </div>
        </div>
    );
}