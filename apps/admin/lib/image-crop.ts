import { type PixelCrop } from "react-image-crop";

export async function createCircularCroppedImage(
  image: HTMLImageElement,
  crop: PixelCrop,
) {
  const canvas = document.createElement("canvas");
  setCanvasPreview(image, canvas, crop);

  const size = Math.min(canvas.width, canvas.height);
  const output = document.createElement("canvas");
  output.width = size;
  output.height = size;
  const ctx = output.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(
    canvas,
    (size - canvas.width) / 2,
    (size - canvas.height) / 2,
    canvas.width,
    canvas.height,
  );
  ctx.restore();

  return output.toDataURL("image/png");
}

export function setCanvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();
}
