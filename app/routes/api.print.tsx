import { ActionFunction } from "react-router";
import { spawn } from "child_process";

export const action = async ({ request }:ActionFunction ) => {
  const formData = new URLSearchParams(await request.text());
  const data = formData.get("data");  // The string to generate QR code from

  if (!data) {
    return { error: "No data provided." , status:400};
  }

  try {
    // Call Python script to generate and print the QR code
    const result = await printQRCode(data);
    return { message: "QR code printed successfully!" };
  } catch (error) {
    return { error: error, status: 500 };
  }
};

// Helper function to execute the Python script
function printQRCode(data: string) {
    console.log('test')
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["/home/phoenix/qr_code_with_text.py", data]);

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
      } else {
        resolve("Success");
      }
    });
  });
}