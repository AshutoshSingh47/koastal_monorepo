"use client";

import { Button } from "@workspace/ui/components/button";
import { CommandDialog } from "@workspace/ui/components/command";
import { Loader2Icon, XIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import { toast } from "sonner";

import { createCircularCroppedImage } from "@/lib/image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "./image-cropper.module.css";

const MIN_PIXEL_SIZE = 140;
const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface Props {
  image: string | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onComplete: (image: string) => void;
}

export function ImageCropper({ image, open, setOpen, onComplete }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    imgRef.current = event.currentTarget;
    const { width, height } = event.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    setCompletedCrop(null);
  }, [image, open]);

  const isReadyToSave = useMemo(() => {
    if (!completedCrop) {
      return false;
    }
    return (
      completedCrop.width >= MIN_PIXEL_SIZE &&
      completedCrop.height >= MIN_PIXEL_SIZE
    );
  }, [completedCrop]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!imgRef.current || !completedCrop || !isReadyToSave) {
      toast.error("Adjust the crop before saving.");
      return;
    }

    try {
      setIsSaving(true);
      const cropped = await createCircularCroppedImage(
        imgRef.current,
        completedCrop,
      );
      onComplete(cropped);
      setOpen(false);
      toast.success("Avatar updated");
    } catch (error) {
      console.error(error);
      toast.error("We couldn't crop this image. Please try another one.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <CommandDialog
        open={open && Boolean(image)}
        onOpenChange={setOpen}
        className="w-full max-w-[430px] top-1/2 -translate-y-1/2 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Crop your new profile picture</h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close image cropper"
            className="text-muted-foreground transition hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {image ? (
          <div
            className={`relative flex flex-col mx-auto w-fit overflow-hidden border border-border bg-slate-950 ${styles.cropShell}`}
          >
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
              circularCrop
              keepSelection
            >
              <img
                src={image}
                alt="Profile avatar to crop"
                style={{ maxHeight: "70vh" }}
                onLoad={handleImageLoad}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </ReactCrop>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Upload an image to start cropping.
          </div>
        )}

        <div className="flex items-center justify-between border-t p-3.5">
          <Button
            type="button"
            className="w-full cursor-pointer"
            disabled={!isReadyToSave || isSaving}
            onClick={handleSubmit}
          >
            {isSaving && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Set new profile picture
          </Button>
        </div>
      </CommandDialog>
    </div>
  );
}
