"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { testData } from "@/data/test-data";
import { generateHRPdf } from "@/utils/generate-hr-pdf";

export default function ReportGenerator() {
  const handleGenerateReport = async (
    type: string,
    contribuyente: (typeof testData)[0]["contribuyente"]
  ) => {
    if (type === "HR") {
      const result = await generateHRPdf(contribuyente);
      if (result.success) {
        const downloadInfoUrl = `/descarga-completada?path=${encodeURIComponent(
          result.downloadPath!
        )}&file=${encodeURIComponent(result.fileName!)}`;
        window.open(downloadInfoUrl, "_blank");
      } else {
        window.alert(
          "No se pudo generar el reporte. Por favor, inténtelo de nuevo."
        );
      }
    }
    // Other report types will be implemented later
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-lg font-bold">
            GENERAR DECLARACIÓN JURADA POR LUGAR
          </h1>
          <Link href="/" className="text-sm hover:underline">
            Ir Inicio
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="bg-gray-100 px-3 py-2 mb-3">
              <h2 className="text-sm font-semibold">Opciones de Búsqueda</h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Departamento:
                  </label>
                  <Select defaultValue="PIURA">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIURA">PIURA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Provincia:
                  </label>
                  <Select defaultValue="PIURA">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIURA">PIURA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Distrito:
                  </label>
                  <Select defaultValue="VEINTISEIS">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VEINTISEIS">
                        VEINTISEIS DE OCTUBRE
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium block mb-1">Año:</label>
                  <Select defaultValue="2024">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-8">
                  <label className="text-xs font-medium block mb-1">
                    Lugar:
                  </label>
                  <div className="flex gap-2">
                    <Input type="text" className="h-8 text-sm" />
                    <Button className="h-8 px-3 text-sm">Buscar</Button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-red-500 font-medium py-1">
                Importante: Debe generar paquetes con un máximo de 250
                Contribuyentes
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Cantidad inicio:
                  </label>
                  <Input
                    type="number"
                    defaultValue="0"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Cantidad fin:
                  </label>
                  <Input
                    type="number"
                    defaultValue="250"
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Nombre Archivo:
                  </label>
                  <Input type="text" className="h-8 text-sm" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="bg-gray-100 px-3 py-2 border-b">
              <h2 className="text-sm font-semibold">LISTA DE LUGARES</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-8 text-xs font-semibold">
                      Id Lugar
                    </TableHead>
                    <TableHead className="h-8 text-xs font-semibold">
                      Nombre Lugar
                    </TableHead>
                    <TableHead className="h-8 text-xs font-semibold">
                      N°HR
                    </TableHead>
                    <TableHead className="h-8 text-xs font-semibold">
                      HR - PU - PR - HRA - DAM - CDN - PAQUETE
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testData.map((item) => (
                    <TableRow key={item.idLugar}>
                      <TableCell className="h-8 text-sm py-2">
                        {item.idLugar}
                      </TableCell>
                      <TableCell className="h-8 text-sm py-2">
                        {item.nombreLugar}
                      </TableCell>
                      <TableCell className="h-8 text-sm py-2">
                        {item.numeroHR}
                      </TableCell>
                      <TableCell className="h-8 text-sm py-2">
                        <div className="flex space-x-1">
                          {[
                            "HR",
                            // "PU",
                            // "PR",
                            // "HRA",
                            // "DAM",
                            // "CDN",
                            // "PAQUETE",
                          ].map((report) => (
                            <Button
                              key={report}
                              size="sm"
                              variant="outline"
                              className="px-2 py-1 text-xs"
                              onClick={() =>
                                handleGenerateReport(report, item.contribuyente)
                              }
                            >
                              {report}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
