// import { ActionFunctionArgs, redirect } from "react-router";
// import { getUserByUsername } from "~/services/filament.server";
// import * as OTPAuth from "otpauth"

// export async function action({ request }: ActionFunctionArgs) {
//     // will receive the user's email or userId
//     // grab the otp secret from db
//     // verify otp 6 digit token
//     // if good redirect to /jobs/create
//     console.log("test")

//     const formData = await request.formData();
//     const username = formData.get("username") as string;
//     const otp = formData.get("otp") as string;

//     if(!username || !otp){
//         return {error: "Username and otp are required"};
//     }

//     const user = await getUserByUsername(username);

//     if(!user || !user.secret) {
//         return {error: "Invalid user or OTP secret missing"};
//     }

//     const totp = new OTPAuth.TOTP({
//         issuer:"FIM",
//         label: username,
//         algorithm: "SHA1",
//         digits: 6,
//         period: 60,
//         secret: user.secret,
//     });
//     const isValid = totp.validate({ token: otp, window: 1}) !== null;
//     if(!isValid) {
//         return { error: "Invalid OTP code"};
//     }

//     return redirect("../../job/create");
// }