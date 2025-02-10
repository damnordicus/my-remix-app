import { ArrowPathIcon, CameraIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Form, useFetcher, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import Badge from "./Badge";

export default function SelectedItem({ selectedItem, onClose }){
    const navigation = useNavigation();
    const [ quantity, setQuantity ] = useState(0);

    useEffect(() => {
      if(navigation.state !== 'idle'){
        setQuantity(0);
        onClose();
      }
    },[navigation.state, onClose])

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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-[400px]  bg-slate-600 rounded-2xl shadow-xl p-6 relative border-2 border-slate-300 `}>
            <p
              className="absolute top-2 right-2 cursor-pointer text-white text-xl"
              onClick={onClose}
            >
              ✖
            </p>
            <p className="text-white font-bold">{selectedItem.brand}</p>
            <div className="flex gap-10">
              <p className="">{selectedItem.material}</p>

              <Badge size={2}>{selectedItem.color}</Badge>
            </div>

            <fetcher.Form method="post" className="mt-4">
              <input type="hidden" name="id" value={selectedItem.id} />
              <input type="hidden" name="option" value={discardVisible ? 'discard' : 'add'}/>
              {/* <BarcodeScanner onScan={handleScan} />
              {scannedBarcode && (
                <p>Scanned code: {scannedBarcode}</p>
              )} */}
              <p>Number of Rolls: {selectedItem.stock_level} </p>
              {/* <input
                type="number"
                name="stock_level"
                placeholder="Increae or decrease total stock"
                onChange={(e) => handleChange(e)}
                className={`w-full p-2 mt-1 rounded-md ${quantity > 0 ? 'text-green-500': quantity === 0 ? 'text-white' : 'text-red-500'}  bg-black border-2 border-amber-500 shadow-lg`}
              /> */}
              <div className="w-full flex justify-around pt-4 ">
                <div
                className="bg-red-500 px-2 py-1 mb-2 rounded-lg"
                onClick={handleDiscard}>
                - Discard A Roll
              </div>
              <div
                className="bg-green-500 px-2 py-1 mb-2 rounded-lg"
                onClick={handleAdd}>
                + Add A Roll
              </div>

              </div>
              {(discardVisible && selectedItem.barcode.length > 0) && (
                <div>
                  <p>Select the barcode to remove:</p>
                  <select name="barcode">
                    {selectedItem.barcode.map((x) => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                    
                  </select>
                </div>
              )}
              {(addVisible) && (
                <div className="w-full text-center mt-2">
                  <input type="number" name="weight" defaultValue={0} placeholder="Weight in grams" className="border border-slate-400 rounded-lg px-2" min={0} step={100}/>
                  <input type="number" name="price" defaultValue={0.00} placeholder="Cost" className="border border-slate-400 rounded-lg px-2 my-2" min={0.00} step={0.01}/>
                </div>
              )}
              
            </fetcher.Form>
          </div>
        </div>
    )
}