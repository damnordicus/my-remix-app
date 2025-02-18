import { data } from "@remix-run/node";
import { request } from "https";

export const loader = async () => {
    return data({});
}

export const action = async ({request}) => {
    const formData = await request.formData();
      const actionType = formData.get("_action");
    
    
      if(actionType === 'submit'){
        const username = formData.get("user") as string;
        const password = formData.get("password") as string;
        
      }
      else {
        return null;
      }
}

export default function PrintJob(){
    return (
        
            <div className="flex w-full min-h-screen items-center justify-center">
                <div className="flex w-[400px] bg-slate-600 rounded-xl border-2 border-slate-400 shadow-xl">
                    <div className="w-full">
                        <h1 className="text-2xl justify-center text-center text-amber-500">Print Job Login</h1>
                        <form>
                            <div className="flex-col w-full">
                                <label htmlFor="username" className="pl-4 text-lg flex w-full">Username: </label>
                                <input type="text" name="username" className="flex pl-4 w-11/12 mx-auto"/>
                                <label htmlFor="password" className="pl-4 text-lg flex">Password: </label>
                                <input type="password" name="password" className=" pl-4 mx-auto w-11/12 flex mb-2"/>
                                <div className="w-full text-center mb-4">
                                   <button className="rounded-xl border-2 border-amber-600 bg-amber-500 px-2 py-1 text-black">Verify</button>
                                </div>
                            </div>
                        </form>
                    </div>                 
                </div>
            </div>
       
    );
}