import { jsPDF } from "jspdf";

// Keeping all the original interfaces
interface PUResult {
  numpu: string;
  codcont: string;
}

interface PUReportResult {
  fecha: string;
  c0500anio: string;
  c0500id_uni_cat: string;
  n0500valuototal: number;
  n0500porctit: number;
}

interface PUTitularesResult {
  nombre_bd: string;
  numero_bd: string;
  id_persona_bd: string;
}

interface PUUbicacionesResult {
  ubicacion: string;
}

interface PUDatosPredioResult {
  condicion: string;
  desc_uso: string;
  condicion_pro: string;
  n0500porctit: number;
  n0500areaterreno: number;
  n0500arancel: number;
  n0500valorterreno: number;
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
  puOtrasConstruccionesResult: PUOtrasConstruccionesResult[] = []
): jsPDF {
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Configuración inicial - fuentes más pequeñas
  const baseFont = 5; // Fuente base reducida
  const denseFont = 4.5; // Fuente para áreas densas
  const ultraDenseFont = 4; // Fuente para áreas muy densas
  const lineWidth = 0.1; // Líneas más delgadas

  doc.setLineWidth(lineWidth);

  // Encabezado principal (mantiene tamaños originales)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("DECLARACIÓN JURADA DEL", 74, 12, { align: "center" });
  doc.text("IMPUESTO PREDIAL", 74, 18, { align: "center" });
  doc.text("PU", 74, 25, { align: "center" });
  doc.setFontSize(10);
  doc.text("PREDIO URBANO", 74, 30, { align: "center" });

  // Información municipal - compacta
  doc.setFontSize(denseFont);
  doc.setFont("helvetica", "normal");
  doc.text("MUNICIPALIDAD DISTRITAL VEINTISÉIS DE", 10, 25);
  doc.text("OCTUBRE", 10, 28);
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H. Las", 10, 31);
  doc.text("Capullanas - Veintiseis de Octubre", 10, 34);
  doc.text("RUC:20529997401", 10, 37);

  // Información de página - compacta
  doc.text("Pag 1 de 1", 120, 8);
  if (puResult.length > 0) {
    doc.text(`N° DE REFERENCIA: ${puResult[0].numpu || ""}`, 120, 11);
    const fecha = new Date(puReportResult[0]?.fecha || "");
    doc.text(`FECHA DE EMISIÓN: ${fecha.toLocaleDateString()}`, 120, 14);
  }

  // Ejercicio fiscal - compacto
  const fiscalY = 40;
  doc.rect(10, fiscalY, 40, 8); // Altura reducida
  doc.setFontSize(denseFont);
  doc.text("EJERCICIO FISCAL", 30, fiscalY + 3, { align: "center" });
  if (puReportResult.length > 0) {
    doc.text(puReportResult[0].c0500anio || "", 30, fiscalY + 6, {
      align: "center",
    });
  }

  // Unidad catastral - compacta
  doc.rect(52, fiscalY, 86, 8);
  doc.text("UNIDAD CATASTRAL", 95, fiscalY + 3, { align: "center" });
  if (puReportResult.length > 0) {
    doc.text(puReportResult[0].c0500id_uni_cat || "", 95, fiscalY + 6, {
      align: "center",
    });
  }

  // Datos del contribuyente - compacto
  const contribY = 50;
  doc.setFontSize(baseFont);
  doc.text("DATOS DEL CONTRIBUYENTE", 10, contribY);
  doc.line(10, contribY + 1, 138, contribY + 1);

  // Tabla de contribuyente - compacta
  doc.setFontSize(denseFont);
  doc.text("APELLIDOS Y NOMBRES / RAZÓN SOCIAL", 11, contribY + 3);
  doc.text("DNI / CIP / RUC", 100, contribY + 3);
  doc.text("CÓDIGO", 125, contribY + 3);

  if (puTitularesResult.length > 0) {
    const titular = puTitularesResult[0];
    doc.text(titular.nombre_bd?.trim() || "", 11, contribY + 6);
    doc.text(titular.numero_bd?.trim() || "", 100, contribY + 6);
    doc.text(titular.id_persona_bd || "", 125, contribY + 6);
  }

  // Datos del predio - compacto
  const predioY = 58;
  doc.setFontSize(baseFont);
  doc.text("DATOS RELATIVOS DEL PREDIO", 10, predioY);
  doc.line(10, predioY + 1, 138, predioY + 1);
  doc.text("UBICACIÓN DEL PREDIO", 10, predioY + 3);

  if (puUbicacionesResult.length > 0) {
    doc.rect(10, predioY + 4, 128, 6);
    doc.setFontSize(denseFont);
    doc.text(puUbicacionesResult[0].ubicacion?.trim() || "", 11, predioY + 8);
  }

  // Tabla de características - compacta
  const caracY = 68;
  const headers = [
    { text: "TIPO DE EDIFICACIÓN", width: 40 },
    { text: "USO", width: 40 },
    { text: "CONDICIÓN DE PROPIEDAD", width: 40 },
    { text: "%PROPIEDAD", width: 20 },
  ];

  doc.setFontSize(ultraDenseFont);
  let currentX = 10;
  headers.forEach((header) => {
    doc.rect(currentX, caracY, header.width, 6);
    doc.text(header.text, currentX + 1, caracY + 4);
    currentX += header.width;
  });

  if (puDatosPredioResult.length > 0) {
    const datos = puDatosPredioResult[0];
    currentX = 10;
    headers.forEach((header, index) => {
      doc.rect(currentX, caracY + 6, header.width, 6);
      let texto = "";
      switch (index) {
        case 0:
          texto = datos.condicion?.trim() || "";
          break;
        case 1:
          texto = datos.desc_uso?.trim() || "";
          break;
        case 2:
          texto = datos.condicion_pro?.trim() || "";
          break;
        case 3:
          texto = Number(datos.n0500porctit || 0).toFixed(3);
          break;
      }
      doc.text(texto, currentX + 1, caracY + 10);
      currentX += header.width;
    });
  }

  // Tabla de terreno - compacta
  const terrenoY = caracY + 12;
  const terrenoHeaders = [
    { text: "ÁREA DE TERRENO (m2)", width: 60 },
    { text: "ARANCEL", width: 40 },
    { text: "VALOR DE TERRENO S/", width: 40 },
  ];

  currentX = 10;
  terrenoHeaders.forEach((header) => {
    doc.rect(currentX, terrenoY, header.width, 6);
    doc.text(header.text, currentX + 1, terrenoY + 4);
    currentX += header.width;
  });

  if (puDatosPredioResult.length > 0) {
    const datos = puDatosPredioResult[0];
    currentX = 10;
    [
      Number(datos.n0500areaterreno || 0).toFixed(2),
      Number(datos.n0500arancel || 0).toFixed(2),
      Number(datos.n0500valorterreno || 0).toFixed(2),
    ].forEach((valor, index) => {
      doc.rect(currentX, terrenoY + 6, terrenoHeaders[index].width, 6);
      doc.text(valor, currentX + 1, terrenoY + 10);
      currentX += terrenoHeaders[index].width;
    });
  }

  // OTRAS INSTALACIONES - ultra compacta
  const instY = 90;
  doc.setFontSize(baseFont);
  doc.text("OTRAS INSTALACIONES", 10, instY);

  const tableY = instY + 2;
  doc.rect(10, tableY, 128, 12);

  // Columnas con espaciado mínimo
  const instColumns = [
    { text: "CÓDIGO", width: 10 },
    { text: "MATERIAL", width: 12 },
    { text: "ESTADO DE\nCONSERVACIÓN", width: 15 },
    { text: "ANTIGÜEDAD", width: 12 },
    { text: "DESCRIPCIÓN", width: 30 },
    { text: "METRADO", width: 12 },
    { text: "VALOR\nUNITARIOS", width: 12 },
    { text: "VALOR DEPRECIADO", subColumns: true, width: 25 },
    {
      text: "VALOR DE OBRAS\nCOMPLEMENTARIAS Y/O\nINSTALACIONES FIJAS Y\nPERMANENTES S/. (VOI)",
      width: 25,
    },
  ];

  let xPos = 10;
  doc.setFontSize(ultraDenseFont);
  instColumns.forEach((col, index) => {
    if (index > 0) doc.line(xPos, tableY, xPos, tableY + 12);

    if (col.subColumns) {
      doc.text(col.text, xPos + 1, tableY + 3);
      doc.line(xPos + 12, tableY + 4, xPos + col.width, tableY + 4);
      doc.text("%", xPos + 2, tableY + 6);
      doc.text("VALOR S/.", xPos + 14, tableY + 6);
    } else {
      doc.text(col.text, xPos + 1, tableY + 3);
    }
    xPos += col.width;
  });

  if (puOtrasConstruccionesResult.length > 0) {
    const otras = puOtrasConstruccionesResult[0];
    doc.text(otras.ant?.toString() || "", 35, tableY + 9);
    doc.text(Number(otras.n0502prod_total || 0).toFixed(2), 85, tableY + 9);
    doc.text(Number(otras.valorunitario || 0).toFixed(2), 97, tableY + 9);
    doc.text(otras.depreciacion?.toString() || "", 110, tableY + 9);
    doc.text(Number(otras.valor || 0).toFixed(2), 125, tableY + 9);
  }
  doc.text("Total", 100, tableY + 11);

  // DETERMINACIÓN DEL VALOR DEL PREDIO - compacto
  const valueY = 106;
  doc.setFontSize(baseFont);
  doc.text("DETERMINACIÓN DEL VALOR DEL PREDIO (S/.)", 10, valueY);

  const boxWidth = 35;
  const boxHeight = 8;
  const boxY = valueY + 2;

  if (puReportResult.length > 0) {
    const report = puReportResult[0];

    // Primera caja
    doc.rect(10, boxY, boxWidth, boxHeight);
    doc.setFontSize(ultraDenseFont);
    doc.text("VALUO TOTAL DEL PREDIO (VT\n+VC + VOI +VAC)", 11, boxY + 3);
    doc.setFontSize(denseFont);
    doc.text(Number(report.n0500valuototal || 0).toFixed(2), 20, boxY + 6);

    // X
    doc.setFontSize(8);
    doc.text("X", 50, boxY + 5);

    // Segunda caja
    doc.rect(60, boxY, boxWidth, boxHeight);
    doc.setFontSize(ultraDenseFont);
    doc.text("% PROPIEDAD", 70, boxY + 3);
    doc.setFontSize(denseFont);
    doc.text(`${Number(report.n0500porctit || 0).toFixed(4)}%`, 70, boxY + 6);

    // =
    doc.setFontSize(8);
    doc.text("=", 100, boxY + 5);

    // Tercera caja
    doc.rect(110, boxY, boxWidth, boxHeight);
    doc.setFontSize(ultraDenseFont);
    doc.text("VALUO DEL PREDIO AFECTO", 111, boxY + 3);
    doc.setFontSize(denseFont);
    const valorAfecto =
      (report.n0500valuototal || 0) * ((report.n0500porctit || 0) / 100);
    doc.text(Number(valorAfecto).toFixed(2), 120, boxY + 6);
  }

  // Número de serie
  doc.setFontSize(8);
  doc.text("043198", 120, boxY + 12);

  return doc;
}
