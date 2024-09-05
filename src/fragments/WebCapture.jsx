import CameraIcon from "@mui/icons-material/Camera";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Fab, Stack } from "@mui/material";
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { centeringStyles } from "../theme";

export const WebcamCapture = React.forwardRef((props, ref) => {
  const webcamRef = useRef(null);

  const [imageSrc, setImageSrc] = useState("");

  const [videoConstraints, setVideoConstraints] = useState({
    width: 640,
    height: 360,
    facingMode: "user",
  });

  const cameraCapture = useCallback(() => {
    let imgSRC = webcamRef.current.getScreenshot();
    setImageSrc(imgSRC);
    console.log(imgSRC);
  }, [webcamRef]);

  const cameraChange = useCallback(() => {
    setVideoConstraints((prevConstraints) => ({
      ...prevConstraints,
      facingMode:
        prevConstraints.facingMode === "user" ? "environment" : "user",
    }));
  });

  const getData = () => {
    return imageSrc;
  };

  useImperativeHandle(ref, () => ({
    getData,
  }));
  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        height={360}
        screenshotFormat="image/webp"
        width={640}
        videoConstraints={videoConstraints}
      />
      <Stack direction={"row"} spacing={2} sx={centeringStyles}>
        <Fab size="small" onClick={cameraChange} aria-label="change">
          <CameraswitchIcon />
        </Fab>
        <Fab onClick={cameraCapture} color="primary" aria-label="add">
          <CameraIcon />
        </Fab>
        <Fab size="small" onClick={cameraCapture} aria-label="add">
          <FlashOnIcon />
        </Fab>
      </Stack>
    </>
  );
});

export default WebcamCapture;
