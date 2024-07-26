"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

export default function Editor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const QuillEditor = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="bg-white">
      <QuillEditor
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
