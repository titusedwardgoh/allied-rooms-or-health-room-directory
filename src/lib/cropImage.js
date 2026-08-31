export const CROP_ASPECT = 16 / 9;
export const MIN_CROP_WIDTH = 800;
export const MIN_CROP_HEIGHT = Math.round(MIN_CROP_WIDTH / CROP_ASPECT);

const MAX_OUTPUT_WIDTH = 1920;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const finish = () => {
        if ((image.naturalWidth || image.width) > 0) resolve(image);
        else reject(new Error("Could not read this photo."));
      };
      if (typeof image.decode === "function") {
        image.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    };
    image.onerror = () => reject(new Error("Could not read this photo."));
    image.src = src;
  });
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read this photo."));
    reader.readAsDataURL(file);
  });
}

export function ensurePhotoFile(item, fallbackName = "photo.jpg") {
  if (item instanceof File) return item;
  if (item instanceof Blob) {
    return new File([item], fallbackName, {
      type: item.type || "image/jpeg",
      lastModified: Date.now(),
    });
  }
  return null;
}

function areaToPixels(area, imageWidth, imageHeight) {
  const cropX = (Number(area?.x) / 100) * imageWidth;
  const cropY = (Number(area?.y) / 100) * imageHeight;
  const cropW = (Number(area?.width) / 100) * imageWidth;
  const cropH = (Number(area?.height) / 100) * imageHeight;
  return { cropX, cropY, cropW, cropH };
}

export async function cropImageFile(imageSrc, cropArea, originalName) {
  const image = await loadImage(imageSrc);
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  const { cropX, cropY, cropW, cropH } = areaToPixels(
    cropArea,
    imageWidth,
    imageHeight,
  );

  if (
    !Number.isFinite(cropX) ||
    !Number.isFinite(cropY) ||
    !Number.isFinite(cropW) ||
    !Number.isFinite(cropH) ||
    cropW < 2 ||
    cropH < 2
  ) {
    throw new Error("Could not crop this photo. Try adjusting the zoom.");
  }

  if (cropW < MIN_CROP_WIDTH || cropH < MIN_CROP_HEIGHT) {
    throw new Error(
      `Zoom out a little — the crop must stay at least ${MIN_CROP_WIDTH}×${MIN_CROP_HEIGHT}px.`,
    );
  }

  let width = Math.round(cropW);
  if (width > MAX_OUTPUT_WIDTH) width = MAX_OUTPUT_WIDTH;
  const height = Math.max(1, Math.round(width / CROP_ASPECT));
  const scale = width / cropW;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not crop this photo.");
  }

  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#fafaf9";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(
    image,
    -cropX * scale,
    -cropY * scale,
    imageWidth * scale,
    imageHeight * scale,
  );

  const base = String(originalName || "room-photo").replace(/\.[^.]+$/, "");
  const fileName = `${base || "room-photo"}.jpg`;
  const previewUrl = canvas.toDataURL("image/jpeg", 0.92);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Could not crop this photo."));
      },
      "image/jpeg",
      0.92,
    );
  });

  const file = new File([blob], fileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  if (!file.size) {
    throw new Error("Could not crop this photo.");
  }

  return { file, previewUrl };
}
