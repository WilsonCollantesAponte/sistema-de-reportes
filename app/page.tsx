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
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function ReportGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [lugar, setLugar] = useState("");
  const [inicio, setInicio] = useState("0");
  const [fin, setFin] = useState("250");
  const [contributors, setContributors] = useState<
    {
      result: string;
      c0505anio: string;
      c0001idlugar: string;
      c0001codpersona: string;
    }[]
  >([]);
  const [year, setYear] = useState("2024");

  const [departamentos, setDepartamentos] = useState<
    { idlugar_bd: string; nombre_bd: string }[]
  >([]);

  const [provincias, setProvincias] = useState<
    { idlugar_bd: string; nombre_bd: string }[]
  >([]);

  const [distritos, setDistritos] = useState<
    { idlugar_bd: string; nombre_bd: string }[]
  >([]);

  const [loadingReports, setLoadingReports] = useState<Record<string, boolean>>(
    {}
  );

  const fetchContributors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/contributors?lugar=${lugar}&inicio=${inicio}&fin=${fin}&year=${year}`
      );
      const data = await response.json();
      setContributors(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (
    codContribuyente: string,
    tipo: string
  ) => {
    setLoadingReports((prev) => ({
      ...prev,
      [`${codContribuyente}-${tipo}`]: true,
    }));
    try {
      const response = await fetch("/api/generar-reporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codContribuyente, tipo, year }),
      });

      if (!response.ok) throw new Error("Error generating report");

      const filename = `${tipo}_${codContribuyente}_${year}.pdf`;
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingReports((prev) => ({
        ...prev,
        [`${codContribuyente}-${tipo}`]: false,
      }));
    }
  };

  useEffect(() => {
    fetch(`/api/cargar-departamentos`)
      .then((response) => response.json())
      .then((data) => setDepartamentos(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900X">
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
                  <Select
                    onValueChange={(value) => {
                      setLugar(value);
                      fetch(
                        `/api/cargar-provincias?mp_id_departamento=${value}`
                      )
                        .then((response) => response.json())
                        .then((data) => {
                          // Handle the fetched provinces data
                          setProvincias(data);
                        })
                        .catch((error) => {
                          console.error("Error fetching provinces:", error);
                        });
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((item, index) => (
                        <SelectItem key={index} value={item.idlugar_bd}>
                          {item.nombre_bd}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Provincia:
                  </label>
                  <Select
                    onValueChange={(value) => {
                      fetch(`/api/cargar-distritos?mp_id_provincia=${value}`)
                        .then((response) => response.json())
                        .then((data) => {
                          // Handle the fetched provinces data
                          setDistritos(data);
                        })
                        .catch((error) => {
                          console.error("Error fetching provinces:", error);
                        });
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {provincias.map((item, index) => (
                        <SelectItem key={index} value={item.idlugar_bd}>
                          {item.nombre_bd}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Distrito:
                  </label>
                  <Select onValueChange={(value) => setLugar(value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {distritos.map((item, index) => (
                        <SelectItem key={index} value={item.idlugar_bd}>
                          {item.nombre_bd}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium block mb-1">Año:</label>
                  <Select value={year} onValueChange={setYear}>
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
                    <Input
                      type="text"
                      className="h-8 text-sm"
                      value={lugar}
                      onChange={(e) => setLugar(e.target.value)}
                    />
                    <Button
                      className="h-8 px-3 text-sm"
                      onClick={fetchContributors}
                    >
                      Buscar
                    </Button>
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
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Cantidad fin:
                  </label>
                  <Input
                    type="number"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
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
              <Button onClick={fetchContributors} disabled={isLoading}>
                {isLoading ? "Cargando..." : "Buscar Contribuyentes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-white">
          <CardContent className="p-0">
            <div className="px-3 py-2 border-b">
              <h2 className="text-sm font-semibold">LISTA DE LUGARES</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-8 text-xs font-semibold">
                      Año
                    </TableHead>
                    <TableHead className="h-8 text-xs font-semibold">
                      c0001idlugar
                    </TableHead>
                    <TableHead className="h-8 text-xs font-semibold">
                      c0001codpersona
                    </TableHead>
                    <TableHead className="h-8 text-xs font-semibold">
                      HR - PU - PR - HRA - DAM - CDN - PAQUETE
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Cargando datos...
                      </TableCell>
                    </TableRow>
                  ) : contributors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No se encontraron datos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contributors.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="h-8 text-sm py-2">
                          {item.c0505anio}
                        </TableCell>
                        <TableCell className="h-8 text-sm py-2">
                          {item.c0001idlugar}
                        </TableCell>
                        <TableCell className="h-8 text-sm py-2">
                          {item.c0001codpersona}
                        </TableCell>
                        <TableCell className="h-8 text-sm py-2">
                          <div className="flex space-x-1">
                            {[
                              "HR",
                              "PU",
                              "PR",
                              "HRA",
                              "DAM",
                              "CDN",
                              "PAQUETE",
                            ].map((tipo) => (
                              <Button
                                key={tipo}
                                size="sm"
                                variant="outline"
                                className={`px-2 py-1 text-xs ${
                                  tipo === "PAQUETE" ? "bg-blue-50" : ""
                                } w-16`}
                                onClick={() =>
                                  handleGenerateReport(
                                    item.c0001codpersona,
                                    tipo
                                  )
                                }
                                disabled={
                                  loadingReports[
                                    `${item.c0001codpersona}-${tipo}`
                                  ]
                                }
                              >
                                {loadingReports[
                                  `${item.c0001codpersona}-${tipo}`
                                ] ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  tipo
                                )}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
