import CameraIcon from "@mui/icons-material/Camera";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Box, Fab, Stack, Typography } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { centeringStyles, boxCam } from "../theme";
import AlertFragment from "./AlertFragmet";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import { sleep } from "../utiles";

export const WebcamCapture = React.forwardRef(
  ({ setImageSrc, imageSrc }, ref) => {
    const webcamRef = useRef(null);

    const [captureFeedback, setCaptureFeedback] = useState("");

    const [videoConstraints, setVideoConstraints] = useState({
      width: 1280,
      height: 720,
      facingMode: "user",
    });

    const cameraCapture = useCallback(async () => {
      setCaptureFeedback(true);
      if (webcamRef.current) {
        let imgSRC = webcamRef.current.getScreenshot({
          width: 1920,
          height: 1080,
        });
        if (imgSRC) {
          await sleep(500);
          setImageSrc(imgSRC);
        }
      }
      setCaptureFeedback(false);
    }, [webcamRef]);

    const clearCapture = useCallback(async () => {
      await sleep(500);
      setImageSrc("");
    });
    const cameraChange = useCallback(() => {
      setVideoConstraints((prevConstraints) => ({
        ...prevConstraints,
        facingMode:
          prevConstraints.facingMode === "user" ? "environment" : "user",
      }));
    });
    return (
      <>
        {!imageSrc && (
          <Box
            component={"div"}
            sx={{
              ...boxCam,
              position: "relative",
            }}
          >
            {captureFeedback && (
              <Typography
                size="small"
                sx={{
                  ...centeringStyles,
                  width: "100%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
                variant="h2"
              >
                {"CAPTURA"}
              </Typography>
            )}
            <Webcam
              disablePictureInPicture
              audio={false}
              width={"100%"}
              height={"100%"}
              ref={webcamRef}
              screenshotFormat="image/webp"
              videoConstraints={videoConstraints}
            />
          </Box>
        )}
        <Box>
          <Stack direction={"row"} spacing={2} sx={centeringStyles}>
            {imageSrc.length > 0 ? (
              <Box sx={{ width: 40, height: 40 }} />
            ) : (
              <Fab size="small" onClick={cameraChange} aria-label="change">
                <CameraswitchIcon />
              </Fab>
            )}
            <Fab
              onClick={imageSrc.length > 0 ? clearCapture : cameraCapture}
              color="primary"
              aria-label="add"
            >
              {imageSrc.length > 0 ? <FlipCameraIosIcon /> : <CameraIcon />}
            </Fab>
            <Box sx={{ width: 40, height: 40 }} />
          </Stack>
        </Box>
      </>
    );
  }
);

export default WebcamCapture;
