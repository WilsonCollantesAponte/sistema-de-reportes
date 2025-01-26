"use client";

import { Suspense } from "react";
import DescargaCompletadaContent from "./content";

export default function DescargaCompletada() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">Cargando...</div>
        </div>
      }
    >
      <DescargaCompletadaContent />
    </Suspense>
  );
}
