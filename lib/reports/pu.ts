import { jsPDF } from "jspdf";

interface PUResult {
  numpu?: string;
}

interface PUReportResult {
  fecha?: string;
  c0500anio?: string;
  c0500id_uni_cat?: string;
  n0500valuototal?: number;
  n0500porctit?: number;
}

interface PUTitularesResult {
  nombre_bd?: string;
  numero_bd?: string;
  id_persona_bd?: string;
}

interface PUUbicacionesResult {
  ubicacion?: string;
}

interface PUDatosPredioResult {
  condicion?: string;
  desc_uso?: string;
  condicion_pro?: string;
  n0500porctit?: number;
  n0500areaterreno?: number;
  n0500arancel?: number;
  n0500valorterreno?: number;
}

interface PUConstruccionesResult {
  c0501numpiso: string;
  mepdesc: string;
  escdesc: string;
  ant: number;
  valorunitario: number;
  areaconstruida: number;
  valorconstruccion: number;
}

interface PUOtrasConstruccionesResult {
  cod: string;
  c0502mep: string;
  mepdesc: string;
  ant: number;
  descripcion: string;
  n0500prod_total: number;
  n0502prod_total: number;
  valorunitario: number;
  depreciacion: number;
  valordepreciado: number;
  valor: number;
}

export function generatePU(
  puResult: PUResult[] = [],
  puReportResult: PUReportResult[] = [],
  puTitularesResult: PUTitularesResult[] = [],
  puUbicacionesResult: PUUbicacionesResult[] = [],
  puDatosPredioResult: PUDatosPredioResult[] = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  puConstruccionesResult: PUConstruccionesResult[] = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  puOtrasConstruccionesResult: PUOtrasConstruccionesResult[] = []
): jsPDF {
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Header Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARACIÓN JURADA DEL", 74, 25, { align: "center" });
  doc.text("IMPUESTO PREDIAL", 74, 32, { align: "center" });

  // PU Section
  doc.setFontSize(20);
  doc.text("PU", 74, 45, { align: "center" });
  doc.setFontSize(11);
  doc.text("PREDIO URBANO", 74, 55, { align: "center" });

  // Municipality Info - Adjusted to align with PU
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("MUNICIPALIDAD DISTRITAL VEINTISÉIS DE", 5, 42);
  doc.text("OCTUBRE", 5, 46);
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H. Las", 5, 50);
  doc.text("Capullanas - Veintiseis de Octubre", 5, 54);
  doc.text("RUC:20529997401", 5, 58);

  // Page info - Moved more towards the left and aligned with PU
  doc.text("Pag 1 de 1", 120, 42);
  if (puResult.length > 0) {
    doc.text(`N° DE REFERENCIA: ${puResult[0].numpu || ""}`, 110, 46);
    if (puReportResult.length > 0) {
      const fecha = new Date(puReportResult[0].fecha || "");
      doc.text(`FECHA DE EMISIÓN: ${fecha.toLocaleDateString()}`, 110, 50);
    }
  }

  // Adjusted boxY to accommodate the new text positions
  const boxY = 60;

  // Fiscal Year and Cadastral Unit boxes
  doc.rect(5, boxY, 45, 10);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("EJERCICIO FISCAL", 27.5, boxY + 4, { align: "center" });

  if (puReportResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(puReportResult[0].c0500anio || "", 27.5, boxY + 8, {
      align: "center",
    });
  }

  doc.rect(55, boxY, 88, 10);
  doc.setFont("helvetica", "bold");
  doc.text("UNIDAD CATASTRAL", 99, boxY + 4, { align: "center" });

  if (puReportResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(puReportResult[0].c0500id_uni_cat || "", 99, boxY + 8, {
      align: "center",
    });
  }

  // Taxpayer Data
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CONTRIBUYENTE", 5, boxY + 16);
  // doc.line(5, boxY + 16, 143, boxY + 16);

  // Taxpayer Table
  doc.rect(5, boxY + 18, 138, 8);
  doc.setFontSize(5);
  doc.text("APELLIDOS Y NOMBRES / RAZÓN SOCIAL", 7, boxY + 21);
  doc.text("DNI / CIP / RUC", 95, boxY + 21);
  doc.text("CÓDIGO", 120, boxY + 21);

  if (puTitularesResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(puTitularesResult[0].nombre_bd?.trim() || "", 7, boxY + 24);
    doc.text(puTitularesResult[0].numero_bd?.trim() || "", 95, boxY + 24);
    doc.text(puTitularesResult[0].id_persona_bd || "", 120, boxY + 24);
  }

  // Property Data
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS RELATIVOS DEL PREDIO", 5, boxY + 29);
  // doc.line(5, boxY + 29, 143, boxY + 29);

  doc.setFontSize(5);
  doc.text("UBICACIÓN DEL PREDIO", 5, boxY + 32);
  doc.rect(5, boxY + 33, 138, 6);

  if (puUbicacionesResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(puUbicacionesResult[0].ubicacion?.trim() || "", 7, boxY + 37);
  }

  // Property Characteristics Table
  const caracY = boxY + 40;
  doc.rect(5, caracY, 45, 5);
  doc.rect(50, caracY, 45, 5);
  doc.rect(95, caracY, 35, 5);
  doc.rect(130, caracY, 13, 5);

  doc.setFontSize(4.5);
  doc.text("TIPO DE EDIFICACIÓN", 7, caracY + 3);
  doc.text("USO", 52, caracY + 3);
  doc.text("CONDICIÓN DE PROPIEDAD", 97, caracY + 3);
  doc.text("%PROPIEDAD", 132, caracY + 3);

  if (puDatosPredioResult.length > 0) {
    const datos = puDatosPredioResult[0];
    doc.rect(5, caracY + 5, 45, 5);
    doc.rect(50, caracY + 5, 45, 5);
    doc.rect(95, caracY + 5, 35, 5);
    doc.rect(130, caracY + 5, 13, 5);

    doc.setFont("helvetica", "normal");
    doc.text(datos.condicion?.trim() || "", 7, caracY + 8);
    doc.text(datos.desc_uso?.trim() || "", 52, caracY + 8);
    doc.text(datos.condicion_pro?.trim() || "", 97, caracY + 8);
    doc.text((datos.n0500porctit || 0).toFixed(2), 132, caracY + 8);
  }

  // Land Area Table
  const terrenoY = caracY + 12;
  doc.rect(5, terrenoY, 65, 5);
  doc.rect(70, terrenoY, 40, 5);
  doc.rect(110, terrenoY, 33, 5);

  doc.text("ÁREA DE TERRENO (m2)", 7, terrenoY + 3);
  doc.text("ARANCEL", 72, terrenoY + 3);
  doc.text("VALOR DE TERRENO S/.", 112, terrenoY + 3);

  if (puDatosPredioResult.length > 0) {
    const datos = puDatosPredioResult[0];
    doc.rect(5, terrenoY + 5, 65, 5);
    doc.rect(70, terrenoY + 5, 40, 5);
    doc.rect(110, terrenoY + 5, 33, 5);

    doc.text((datos.n0500areaterreno || 0).toFixed(2), 65, terrenoY + 8, {
      align: "right",
    });
    doc.text((datos.n0500arancel || 0).toFixed(2), 105, terrenoY + 8, {
      align: "right",
    });
    doc.text((datos.n0500valorterreno || 0).toFixed(2), 138, terrenoY + 8, {
      align: "right",
    });
  }

  // Other Installations Section
  const instY = terrenoY + 33;
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("OTRAS INSTALACIONES", 5, instY + 1.5);
  // doc.line(5, instY + 1, 143, instY + 1);

  // Tabla principal
  const tableY = instY + 3;
  doc.rect(5, tableY, 138, 32); // Marco principal

  // Definir columnas con sus anchos exactos (reducidos)
  const cols = [
    { x: 5, width: 8, text: "CÓDIGO" },
    { x: 13, width: 8, text: "MATERIAL" },
    { x: 21, width: 12, text: "ESTADO DE\nCONSERVACIÓN" },
    { x: 33, width: 10, text: "ANTIGÜEDAD" },
    { x: 43, width: 42, text: "DESCRIPCIÓN", horizontal: true },
    { x: 85, width: 12, text: "METRADO" },
    { x: 97, width: 15, text: "VALOR\nUNITARIOS M2" },
    { x: 112, width: 16, text: "VALOR\nDEPRECIADO" }, // Columna compuesta
    {
      x: 128,
      width: 15,
      text: "VALOR DE OBRAS\nCOMPLEMENTARIAS\nY/O\nINSTALACIONES FIJAS\nY PERMANENTES\nS/. (VOI)",
    },
  ];

  // Dibujar líneas verticales y headers
  doc.setFontSize(4.5);
  cols.forEach((col, i) => {
    // Línea vertical
    if (i > 0) {
      doc.line(col.x, tableY, col.x, tableY + 32);
    }

    // Texto del header
    if (col.horizontal) {
      doc.text(col.text, col.x + col.width / 2, tableY + 4, {
        align: "center",
      });
    } else {
      doc.text(col.text, col.x + 4, tableY + 19, { angle: 90 });
    }
  });

  // Línea horizontal que divide headers de valores
  doc.line(5, tableY + 20, 143, tableY + 20);

  // Manejo especial para VALOR DEPRECIADO
  doc.line(112 + 8, tableY, 112 + 8, tableY + 32); // Línea divisoria entre % y VALOR S/.
  doc.text("%", 112 + 4, tableY + 15, { angle: 90 });
  doc.text("VALOR S/.", 112 + 12, tableY + 15, { angle: 90 });

  // Fila de datos
  const dataY = tableY + 25;
  doc.setFont("helvetica", "normal");
  [
    "", // CÓDIGO
    "", // MATERIAL
    "", // ESTADO DE CONSERVACIÓN
    "0", // ANTIGÜEDAD
    "", // DESCRIPCIÓN
    "0.00", // METRADO
    "0.00", // VALOR UNITARIOS
    ["0.00", "0"], // VALOR DEPRECIADO [%, VALOR S/.]
    "0.00", // VALOR DE OBRAS
  ].forEach((value, i) => {
    const col = cols[i];
    if (Array.isArray(value)) {
      // Para VALOR DEPRECIADO
      doc.text(value[0], col.x + 2, dataY); // %
      doc.text(value[1], col.x + 10, dataY); // VALOR S/.
    } else {
      doc.text(value, col.x + 2, dataY);
    }
  });

  // Total
  doc.line(112, tableY + 32, 143, tableY + 32);
  doc.text("Total", 114, tableY + 31);
  doc.text("0", 141, tableY + 31, { align: "right" });

  // Value Determination Section
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DETERMINACIÓN DEL VALOR DEL PREDIO (S/.)", 5, tableY + 38);

  if (puReportResult.length > 0) {
    const report = puReportResult[0];
    const boxY2 = tableY + 39;

    // First Box
    doc.rect(5, boxY2, 40, 15);
    doc.setFontSize(4.5);
    doc.text("VALUO TOTAL DEL PREDIO (VT\n+VC + VOI +VAC)", 7, boxY2 + 4);
    doc.text((report.n0500valuototal || 0).toFixed(2), 43, boxY2 + 12, {
      align: "right",
    });

    // X symbol
    doc.setFontSize(12);
    doc.text("X", 47, boxY2 + 8);

    // Second Box
    doc.rect(55, boxY2, 40, 15);
    doc.setFontSize(4.5);
    doc.text("% PROPIEDAD", 57, boxY2 + 4);
    doc.text(`${(report.n0500porctit || 0).toFixed(3)}%`, 93, boxY2 + 12, {
      align: "right",
    });

    // = symbol
    doc.setFontSize(12);
    doc.text("=", 97, boxY2 + 8);

    // Third Box
    doc.rect(105, boxY2, 40, 15);
    doc.setFontSize(4.5);
    doc.text("VALUO DEL PREDIO AFECTO", 107, boxY2 + 4);
    const valorAfecto =
      (report.n0500valuototal || 0) * ((report.n0500porctit || 0) / 100);
    doc.text(valorAfecto.toFixed(2), 143, boxY2 + 12, { align: "right" });
  }

  // Serial number
  doc.setFontSize(8);
  doc.text("043198", 132, boxY + 147);

  return doc;
}
