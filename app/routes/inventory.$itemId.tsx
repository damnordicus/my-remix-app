import { ArrowPathIcon, CameraIcon, TrashIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { Form, Link, useFetcher, useLoaderData, useNavigate, useNavigation, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import { getFilamentById } from "~/services/filament.server";

export const loader = async ({ request, params }) => {
  const filamentId = +params.itemId;
  const selectedFilament = await getFilamentById(filamentId);
  return {selectedFilament};
};

export default function SelectedItem(){

    const { selectedFilament } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [ quantity, setQuantity ] = useState(0);

    // useEffect(() => {
    //   if(navigate.state !== 'idle'){
    //     setQuantity(0);
    //     navigate(-1);
    //   }
    // },[navigate.state, onclose])

    const [ scannedBarcode, setScannedBarcode ] = useState(null);
    const [ discardVisible, setDiscardVisible ] = useState(false);
    const [ addVisible, setAddVisible] = useState(false);

    const fetcher = useFetcher();

    

    function handleScan(barcode) {
      console.log("barcode: ", barcode);
      setScannedBarcode(barcode);
    }

    function handleChange(e){
      setQuantity(parseInt(e.target.value));
    }

    function handleDiscard(){
      setDiscardVisible(!discardVisible);
      setAddVisible(false);
    };

    function handleAdd(){
      setAddVisible(!addVisible);
      setDiscardVisible(false);
    }

    if(selectedFilament === null){
      return (<div>No filament found.</div>)
    }else{
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-[400px]  bg-slate-600 rounded-2xl shadow-xl p-6 relative border-2 border-slate-300 `}>
            <p
              className="absolute top-2 right-2 cursor-pointer text-white text-xl"
              onClick={() => navigate(-1)}
            >
              ✖
            </p>
            <p className="text-white font-bold">{selectedFilament.brand}</p>
            <div className="flex gap-10">
              <p className="">{selectedFilament.material}</p>

              <Badge size={2}>{selectedFilament.color}</Badge>
            </div>

            <fetcher.Form method="post" className="mt-4">
              <input type="hidden" name="id" value={selectedFilament.id} />
              <input type="hidden" name="option" value={discardVisible ? 'discard' : 'add'}/>
              {/* <BarcodeScanner onScan={handleScan} />
              {scannedBarcode && (
                <p>Scanned code: {scannedBarcode}</p>
              )} */}
              <p>Number of Rolls: {selectedFilament.stock_level} </p>
              {/* <input
                type="number"
                name="stock_level"
                placeholder="Increae or decrease total stock"
                onChange={(e) => handleChange(e)}
                className={`w-full p-2 mt-1 rounded-md ${quantity > 0 ? 'text-green-500': quantity === 0 ? 'text-white' : 'text-red-500'}  bg-black border-2 border-amber-500 shadow-lg`}
              /> */}
              <div className="w-full flex justify-around pt-4 ">
                <div
                className="bg-red-500 px-2 py-1 mb-2 rounded-lg shadow-lg"
                onClick={handleDiscard}>
                - Discard A Roll
              </div>
              <div
                className="bg-green-500 px-2 py-1 mb-2 rounded-lg shadow-lg"
                onClick={handleAdd}>
                + Add A Roll
              </div>

              </div>
              {(discardVisible && selectedFilament.barcode.length > 0) && (
                <div>
                  <p>Select the barcode to remove:</p>
                  <select name="barcode">
                    {selectedFilament.barcode.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                    
                  </select>
                </div>
              )}
              {(addVisible) && (
                <div className="w-full text-center mt-2 flex flex-col">
                  <input type="number" name="weight" placeholder="Weight in grams" className="border border-slate-400 rounded-lg px-2" min={0} step={100}/>
                  <input type="number" name="price" placeholder="Cost" className="border border-slate-400 rounded-lg px-2 my-2" min={0.00} step={0.01}/>
                  <div className="w-full flex justify-center text-center items-center"><Link to={`/qr/${selectedItem.id}.svg`} className="flex bg-amber-500 items-center p-1 rounded-lg  mt-2 shadow-lg" reloadDocument><QrCodeIcon className="size-7 mr-1"/> Save SVG</Link><Link to={`/qr/${selectedItem.id}.png`} className="flex bg-amber-500 items-center p-1 rounded-lg  mt-2 shadow-lg" reloadDocument><QrCodeIcon className="size-7 mr-1"/> Save PNG</Link></div>
                </div>
              )}
              
            </fetcher.Form>
          </div>
        </div>
    )
  }
}