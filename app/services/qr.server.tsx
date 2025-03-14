import * as qr from "qr-image";
import ipp from "ipp";
import { createCanvas, loadImage } from "canvas";
import { i } from "node_modules/@react-router/dev/dist/routes-DHIOx0R9";

export async function generateQr(id: string, type: "png" | "svg") {
  const generatedQr = qr.imageSync(id, {
    type: "png",
    size: 14,
    margin: 5,
    ec_level: "M",
  });

  const qrImage = await loadImage(generatedQr);

  const qrWidth = qrImage.width;
  const qrHeight = qrImage.height;

  const canvasWidth = qrWidth;
  const canvasHeight = id.slice(0, 7) === "otpauth" ? qrHeight : qrHeight + 50;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";

  console.log("slice", id.slice(0, 6));
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  // const qrSize = 340;
  ctx.drawImage(qrImage, (canvasWidth - qrWidth) / 2, 0, qrWidth, qrHeight);
  if (!id.startsWith("otpauth")) {
    // Extract the last 12 characters to match Python version
    const last12Chars = id.slice(-12).toLocaleUpperCase();

    // Configure text styling - bold and centered like in Python
    ctx.font = "30px sans-serif"; // Approximately matching DejaVuSans-Bold in Python
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    // Position text centered horizontally, 5px below QR image
    ctx.fillText(last12Chars, canvasWidth / 2, qrHeight + 30);
  }
  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

export async function printQRCode(
  qrCodeBuffer: Buffer,
  printerName = "DYMO_LabelWriter_330"
) {
  // Configure your Raspberry Pi's IP and printer name
  const printer = new ipp.Printer(
    `http://10.0.30.153:631/printers/${printerName}`
  );

  const msg: ipp.PrintJobRequest = {
    "operation-attributes-tag": {
      "requesting-user-name": "RemixApp",
      "job-name": "QR Code Print",
      "document-format": "image/png",
    },
    data: qrCodeBuffer,
  };

  try {
    const printJobResponse = await new Promise<Error | ipp.PrintJobResponse>(
      (resolve, reject) => {
        printer.execute("Print-Job", msg, function (err, res) {
          if (err) {
            console.error("Printing error:", err);
            reject(err);
          } else {
            console.log("Print job submitted successfully:", res);
            resolve(res);
          }
        });
      }
    );

    if (printJobResponse instanceof Error) throw printJobResponse;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const status = await checkPrintJobStatus(printJobResponse, printer);
    console.log(status)
    if (status === "pending"){
      console.log("need to cancel");

      const cancelJobRequest: ipp.CancelReleaseJobRequest = {
        "operation-attributes-tag": {
          "requesting-user-name": "RemixApp",
          "job-uri": printJobResponse["job-attributes-tag"]["job-uri"],
        },
      };
    
      try {
        const cancelJobResponse = await new Promise<Error | unknown>(
          (resolve, reject) => {
            printer.execute("Cancel-Job", cancelJobRequest, (err, res) => {
              if (err) {
                console.error("Error cancelling job:", err);
                reject(err);
              } else {
                console.log("Print job cancelled successfully:", res);
                resolve(res);
              }
            });
          }
        );
    
        if (cancelJobResponse instanceof Error) throw cancelJobResponse;
        console.log("Job cancellation response:", cancelJobResponse);
      } catch (e) {
        console.error("Error while cancelling job:", e);
      }
    } else if(status === "processing"){
      console.log("complete")
    }

   

  } catch (e) {
    console.error(e);
  }
}

export async function checkPrintJobStatus(printJobResponse, printer: ipp.Printer){
  const test: ipp.GetJobAttributesRequest = {
    "operation-attributes-tag": {
      "job-uri": printJobResponse["job-attributes-tag"]["job-uri"],
      "requested-attributes": ["job-state"],
    },
  };

  const getJobAttributesResponse = await new Promise<
    Error | ipp.GetJobAttributesResponse
  >((res, rej) => {
    printer.execute("Get-Job-Attributes", test, (err, response) => {
      if (err) {
        console.error("Error getting status:", err);
        rej(err);
      } else {
        console.log("Print job status:", response);
        res(response);
      }
    });
  });

  if (getJobAttributesResponse instanceof Error)
    throw getJobAttributesResponse;

 return getJobAttributesResponse["job-attributes-tag"]["job-state"];
}
