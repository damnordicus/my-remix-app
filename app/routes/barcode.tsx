import React, { useEffect, useState } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";
import Webcam from "react-webcam";
import { redirect, useNavigate, useSearchParams } from "react-router";

export const BarcodeScannerComponent = ({
  onUpdate,
  onError,
  width = "100%",
  height = "100%",
  facingMode = "environment",
  torch,
  delay = 500,
  videoConstraints,
  stopStream,
}: {
  onUpdate: (arg0: unknown, arg1?: Result) => void;
  onError?: (arg0: string | DOMException) => void;
  width?: number | string;
  height?: number | string;
  facingMode?: "environment" | "user";
  torch?: boolean;
  delay?: number;
  videoConstraints?: MediaTrackConstraints;
  stopStream?: boolean;
}): React.ReactElement => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const codeReader = new BrowserMultiFormatReader();
    // @ts-ignore
    const imageSrc = webcamRef?.current?.getScreenshot();
    // console.log(imageSrc)
    if (imageSrc) {
      codeReader
        .decodeFromImage(undefined, imageSrc)
        .then((result) => {
          onUpdate(null, result);
        })
        .catch((err) => {
          onUpdate(err);
        });
    }
  }, [onUpdate]);

  React.useEffect(() => {
    // Turn on the flashlight if prop is defined and device has the capability
    if (
      typeof torch === "boolean" &&
      // @ts-ignore
      navigator?.mediaDevices?.getSupportedConstraints().torch
    ) {
      // @ts-ignore
      const stream = webcamRef?.current?.video.srcObject;
      const track = stream?.getVideoTracks()[0]; // get the active track of the stream
      if (
        track &&
        track.getCapabilities().torch &&
        !track.getConstraints().torch
      ) {
        track
          .applyConstraints({
            advanced: [{ torch }],
          })
          .catch((err: any) => onUpdate(err));
      }
    }
  }, [torch, onUpdate]);

  React.useEffect(() => {
    if (stopStream) {
      // @ts-ignore
      let stream = webcamRef?.current?.video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track: any) => {
          stream.removeTrack(track);
          track.stop();
        });
        stream = null;
      }
    }
  }, [stopStream]);

  React.useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Webcam
        width={width}
        height={height}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={
          videoConstraints || {
            facingMode,
          }
        }
        audio={false}
        onUserMediaError={onError}
      />
    </>
  );
};

export default function Barcode() {
  const [data, setData] = useState("No Barcode Scanned");
  const [stopStream, setStopStream] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkTo = searchParams.get('from')

  useEffect(() => {
    if (data !== '' && data !== 'No Barcode Scanned') {
      setStopStream(true);

      localStorage.setItem('scannedBarcode', data)
      // window.close();
      console.log('linkTo: ', linkTo)
      if(linkTo) {
        navigate(`../${linkTo}/?selection=${data}&${searchParams.toString()}`);
      }else{
        navigate(`../return?selection=${data}`)
      }
      
      console.log(`go get the data for ${data}`)
    }
  }, [data])

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className=" flex-col justify-center bg-slate-600/50 backdrop-blur-sm border-2 border-slate-500 rounded-xl p-4">
      <BarcodeScannerComponent
        width={500}
        height={500}
        stopStream={stopStream}
        onUpdate={(err, result) => {
          if (!stopStream) {
            if (result) {
              setData(result.text);
            }
            else setData("No Barcode Scanned");
          }
        }}
      />
      <p className="w-full text-center pt-2">{data}</p>
      </div>
    </div>
  );
}