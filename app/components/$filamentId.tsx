import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Form, useNavigation } from "@remix-run/react";
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
    

    function handleScan(barcode) {
      console.log("barcode: ", barcode);
      setScannedBarcode(barcode);
    }

    function handleChange(e){
      setQuantity(parseInt(e.target.value));
    }
    console.log('q: ', typeof quantity)
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-[400px] h-[250px] bg-slate-600 rounded-2xl shadow-xl p-6 relative border-2 border-slate-300 `}>
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

            <Form method="post" className="mt-4">
              <input type="hidden" name="id" value={selectedItem.id} />
              {/* <BarcodeScanner onScan={handleScan} />
              {scannedBarcode && (
                <p>Scanned code: {scannedBarcode}</p>
              )} */}
              <p>Current Quantity: {selectedItem.stock_level} </p>
              <input
                type="number"
                name="stock_level"
                placeholder="Increae or decrease total stock"
                onChange={(e) => handleChange(e)}
                className={`w-full p-2 mt-1 rounded-md ${quantity > 0 ? 'text-green-500': quantity === 0 ? 'text-white' : 'text-red-500'}  bg-black border-2 border-amber-500 shadow-lg`}
              />
              <div className="flex mt-5 justify-center gap-2">
              <button
                type="submit"
                name="_action"
                value="update"
                className=" bg-amber-500 text-amber-800 p-2 rounded-lg shadow-lg"
              >
                <ArrowPathIcon className="size-7" />
              </button>
              <button 
              type="submit"
              name="_action"
              value="delete"
              className="bg-red-500 text-red-800 p-2 rounded-lg shadow-lg">
                <TrashIcon className="size-7"/>
              </button>
              </div>
            </Form>
          </div>
        </div>
    )
}