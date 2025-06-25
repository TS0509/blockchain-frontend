"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface Props {
  onCapture: (blob: Blob) => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        alert("无法访问摄像头，请检查权限");
      }
    };
    startCamera();
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setPreviewBlob(blob);
        onCapture(blob);
      }
    }, "image/jpeg");
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} autoPlay playsInline className="w-full rounded border" />

      <button
        onClick={handleCapture}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        拍照
      </button>

      {previewBlob && (
        <Image
          src={URL.createObjectURL(previewBlob)}
          alt="预览图像"
          width={300}
          height={300}
          className="rounded shadow"
        />
      )}
    </div>
  );
};

export default CameraCapture;
