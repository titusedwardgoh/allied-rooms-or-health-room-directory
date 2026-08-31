"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { X } from "lucide-react";
import { CROP_ASPECT, cropImageFile } from "@/lib/cropImage";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

export default function PhotoCropModal({ file, onClose, onSave }) {
  const stageRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSize, setCropSize] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setError("");
  }, [file]);

  useEffect(() => {
    if (!file) {
      setImageSrc("");
      return undefined;
    }

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled) setImageSrc(String(reader.result || ""));
    };
    reader.onerror = () => {
      if (!cancelled) setError("Could not read this photo.");
    };
    reader.readAsDataURL(file);

    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event) {
      if (event.key === "Escape" && !saving) onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, saving]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;

    function updateSize() {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width > 1 && height > 1) {
        setCropSize({ width, height });
      }
    }

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, imageSrc]);

  async function handleSave() {
    if (!file || !imageSrc || !croppedArea || saving) return;

    const cropWidth = Number(croppedArea.width);
    if (!Number.isFinite(cropWidth) || cropWidth <= 0) {
      setError("Could not crop this photo. Try adjusting the zoom.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const cropped = await cropImageFile(imageSrc, croppedArea, file.name);
      onSave(cropped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not crop this photo.");
      setSaving(false);
    }
  }

  if (!mounted || !file) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/80 p-4"
      onClick={() => {
        if (!saving) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Edit photo crop"
    >
      <div
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-stone-900">Edit photo</p>
            <p className="text-xs text-stone-500">
              Drag to reposition. Zoom out to fit more of the photo, or zoom in
              to crop. Saved as 16:9.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="cursor-pointer rounded-full p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-800 disabled:opacity-40"
            aria-label="Close editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={stageRef}
          className="photo-crop-stage relative aspect-video w-full overflow-hidden bg-stone-900"
        >
          {imageSrc && cropSize ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={CROP_ASPECT}
              cropSize={cropSize}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(area) => setCroppedArea(area)}
              objectFit="contain"
              showGrid
            />
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-stone-400">
              Loading photo…
            </p>
          )}
        </div>

        <div className="space-y-3 px-4 py-4">
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
              Zoom
              <span className="font-medium normal-case tracking-normal text-stone-500">
                {zoom.toFixed(1)}×
              </span>
            </span>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full cursor-pointer accent-teal-900"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="cursor-pointer rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !croppedArea}
              className="cursor-pointer rounded-full bg-teal-900 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-950 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save crop"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
