import React, { useRef, useState } from "react";

const Signature = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    console.log('start')
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  };

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

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
       <button onClick={handleCopy}>Save</button>
    </div>
  );
};

export default Signature;
