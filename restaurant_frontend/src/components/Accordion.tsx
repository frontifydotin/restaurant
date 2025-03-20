// components/Accordion.tsx
"use client"
import { useState } from "react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border rounded">
      <div
        className="p-4 bg-gray-200 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {title}
      </div>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}
