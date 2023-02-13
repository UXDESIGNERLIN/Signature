import React, { useRef, useState, useEffect } from "react";
import './Signature.css'

const Signature = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevCanvasState, setPrevCanvasState] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setPrevCanvasState(canvas.toDataURL());
    const mouseDownHandler = (e) => {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };
    const mouseUpHandler = () => {
      setIsDrawing(false);
      setPrevCanvasState(canvas.toDataURL());
    };
    const mouseMoveHandler = (e) => {
      if (!isDrawing) return;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };
    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);
    canvas.addEventListener("mousemove", mouseMoveHandler);
    return () => {
      canvas.removeEventListener("mousedown", mouseDownHandler);
      canvas.removeEventListener("mouseup", mouseUpHandler);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [isDrawing]);

  const handleCopy = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const parts = dataURL.split(",");
    const mime = parts[0].split(":")[1].split(";")[0];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    const blob = new Blob([uInt8Array], { type: mime });

    navigator.clipboard
      .write([new ClipboardItem({ [mime]: blob })])
      .then(() => {
        console.log("Image copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying image to clipboard: ", error);
      });
  };

  const clear = () => {
    if (prevCanvasState) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setPrevCanvasState(null);
  };

  return (
    <div className="frame">
      <canvas ref={canvasRef} width={500} height={200} />
      <button onClick={handleCopy} disabled={!prevCanvasState}>Save</button>
      <button onClick={clear}>Undo</button>
    </div>
  );
};

export default Signature;