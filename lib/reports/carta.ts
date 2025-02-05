import { jsPDF } from "jspdf";

interface CartaData {
  nombrecontrib_bd: string;
  lugar_bd: string;
  calle_bd: string;
  direccion_bd: string;
  distrito_bd: string;
  numpaquete: string;
  numhr: string;
  codigo_bd: string;
  anio_bd: number;
  imptopredial_bd: number;
  arbitrio: number;
  total_bd: number;
  numpredios_bd: number;
  municipalidad_bd: string;
  mensaje_bd: string;
  porcdscto_bd: string;
  msjepie_bd: string;
  msjvencimiento_bd: string;
  oficina_bd: string;
  mensajeport_bd: string;
  linkweb_bd: string;
  linkapp_bd: string;
}

export function generateCARTA(obj_data: CartaData[], logo: Uint8Array): jsPDF {
  const data = obj_data[0];

  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Configuración de fuente
  doc.setFont("helvetica");

  // Encabezado con título y descuento
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("DESCUENTO DE ARBITRIOS\nMUNICIPALES", 10, 15);

  doc.setFontSize(20);
  doc.text(`${data.porcdscto_bd}`, 140, 15, { align: "right" });

  // Cuadro de datos del contribuyente
  doc.setDrawColor(0);
  doc.setFillColor(230, 230, 230);
  doc.rect(10, 25, 135, 32, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`CONTRIBUYENTE: ${data.nombrecontrib_bd}`, 12, 30);
  doc.text(`DIRECCIÓN: ${data.direccion_bd}`, 12, 35);
  doc.text(`LUGAR: ${data.lugar_bd}`, 12, 40);
  doc.text(`DISTRITO: ${data.distrito_bd}`, 12, 45);
  doc.text(`CÓDIGO: ${data.codigo_bd.trim()}`, 12, 50);
  doc.text(`NÚMERO DE PREDIOS: ${data.numpredios_bd}`, 12, 55);

  // Tabla de deuda total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DEUDA TOTAL", 10, 64);

  const tableStartY = 70;
  const tableData = [
    ["ARBITRIO MUNICIPAL", data.arbitrio.toFixed(2)],
    ["IMPUESTO PREDIAL", data.imptopredial_bd.toFixed(2)],
    ["TOTAL TRIBUTOS", data.total_bd.toFixed(2)],
    [
      "A PAGAR CON DSCTO",
      (
        data.total_bd *
        (1 - (Number(data.porcdscto_bd.slice(0, -1)) / 100 || 0))
      ).toFixed(2),
    ],
  ];

  let y = tableStartY;
  tableData.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, 12, y);
    doc.text(value, 140, y, { align: "right" });
    doc.line(10, y + 2, 145, y + 2); // Línea divisoria
    y += 7;
  });

  // Mensaje final
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text(`${data.mensajeport_bd}`, 10, y + 10);

  // Pie de página con logo y municipalidad
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.municipalidad_bd}`, 10, y + 20);

  // Logo decorativo (opcional, añadir si se desea)
  //   doc.setDrawColor(0);
  //   doc.setFillColor(200, 200, 200);
  //   doc.rect(60, y + 25, 30, 20, "F");
  //   doc.setFontSize(8);
  doc.addImage(logo, "JPEG", 63.5, y + 37, 25, 25);

  return doc;
}
