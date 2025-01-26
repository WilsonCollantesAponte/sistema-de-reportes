"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";

export default function DescargaCompletadaContent() {
  const searchParams = useSearchParams();
  const downloadPath = searchParams.get("path") || "";
  const fileName = searchParams.get("file") || "";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downloadPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Descarga Completada</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <p className="text-center">
            Su archivo se ha descargado correctamente.
          </p>
          {fileName && (
            <p className="text-sm font-medium">
              Nombre del archivo: {fileName}
            </p>
          )}
          {downloadPath && (
            <div className="w-full">
              <p className="text-sm font-medium mb-2">Ruta de descarga:</p>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <code className="text-xs flex-1 break-all">{downloadPath}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
          <Button onClick={() => window.close()}>Cerrar Ventana</Button>
        </CardContent>
      </Card>
    </div>
  );
}
