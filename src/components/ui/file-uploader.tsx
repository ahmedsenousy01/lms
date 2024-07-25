"use client";

import { type MainFileRouter } from "@/app/api/uploadthing/core";

import { UploadDropzone } from "@/lib/uploadthing";

import { toast } from "./use-toast";

interface FileUploaderProps {
  onChange: (url?: string) => void;
  endpoint: keyof MainFileRouter;
}

export function FileUploader({ onChange, endpoint }: FileUploaderProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={err => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }}
      className="mx-auto max-w-64 sm:max-w-full"
    />
  );
}
