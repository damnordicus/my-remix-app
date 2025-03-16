import {toast} from "react-toastify";
import { ActionFunctionArgs, Form, redirect, useSearchParams } from "react-router";
import { checkEmail, checkPhone, checkUsername, createUser } from "~/services/filament.server";
import { v4 as uuidv4 } from "uuid";
import * as OTPAuth from "otpauth";

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const action = formData.get("_action");
    if (action === "submit") {
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;

        if (!username || !email || !phone) {
            toast.error("All fields are required!");
            return redirect('./?error=missing_fields');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!emailRegex.test(email)) {
            return redirect('./?error=invalid_email');
        }
        
        if (!phoneRegex.test(phone)) {
            return redirect('./?error=invalid_phone');
        }

        let actualUsername = username;
        let isAdmin = false;
        if (username.slice(-3) === '+PS') {
            actualUsername = username.slice(0, username.length - 3);
            isAdmin = true;
        }
        
        const validUsername = await checkUsername(actualUsername);
        const validEmail = await checkEmail(email);
        const validPhone = await checkPhone(phone);

        if (!validUsername && !validEmail && !validPhone) {
            const secret = new OTPAuth.Secret({ size: 20 });
            const totp = new OTPAuth.TOTP({
                issuer: "Filament Inventory Manager",
                label: actualUsername,
                algorithm: "SHA1",
                digits: 6,
                period: 30,
                secret: secret,
            });

            const otpAuthURI = totp.toString();

            await createUser({ actualUsername, email, phone, secret: secret.base32, admin: isAdmin });
            return redirect(`../showQR?uri=${encodeURIComponent(otpAuthURI)}`);
        }

        return redirect('./?error=invalid_credentials');
    }
};

export default function Register() {
    const [searchParams] = useSearchParams();
    const error = searchParams.get("error");

    if (error === "invalid_credentials") {
        toast.error("Username, email, or phone is already in use!");
    } else if (error === "invalid_email") {
        toast.error("Invalid email format!");
    } else if (error === "invalid_phone") {
        toast.error("Phone number must be exactly 10 digits!");
    } else if (error === "missing_fields") {
        toast.error("All fields are required!");
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex-col justify-center bg-slate-600/60 border-2 border-slate-500 backdrop-blur-xs rounded-xl items-center gap-2 p-4">
                <h1 className="text-xl text-amber-400">Register New User</h1>
                <Form method="POST">
                    <div className="flex-col w-full text-lg gap-1 mb-2">
                        <label htmlFor="username" className="py-2 ">Username: </label>
                        <input type="text" className="bg-slate-800/60 py-2 pl-4 rounded-xl border border-slate-400" name="username" required />
                    </div>
                    <div className="flex-col w-full text-lg gap-1 mb-2">
                        <label htmlFor="email " className="py-2 ">Email: </label>
                        <input type="text" className="bg-slate-800/60 py-2 pl-4 rounded-xl border border-slate-400" name="email" required />
                    </div>
                    <div className="flex-col w-full text-lg gap-1 mb-2">
                        <label htmlFor="phone" className="py-2 ">Phone Number: </label>
                        <input type="text" className="bg-slate-800/60 py-2 pl-4 rounded-xl border border-slate-400" name="phone" required />
                    </div>
                    <div>
                        <button type="submit" name="_action" value="submit" className="bg-amber-600 text-white rounded-lg border-2 border-amber-400 px-2 py-2 w-full mt-6">Submit</button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
