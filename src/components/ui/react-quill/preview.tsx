"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

export default function Preview({ value }: { value: string }) {
  const QuillPreview = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <QuillPreview
      theme="bubble"
      value={value}
      readOnly
    />
  );
}
