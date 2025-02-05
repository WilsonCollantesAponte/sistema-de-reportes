import { jsPDF } from "jspdf";

// Interfaces remain unchanged
interface PRResult {
  codcont: string;
  // ... other properties
}

interface PRReportResult {
  c0508anio_bd: number | null;
  c0508id_uni_cat_bd: string | null;
  c0508numpr_bd: string | null;
  n0508valorterreno_bd: number | null;
  n0508valorconstr_bd: number | null;
  n0508valorinstalac_bd: number | null;
  n0508valuototal_bd: number | null;
}

interface PRTitularesResult {
  nombre_bd: string | null;
  numero_bd: string | null;
}

interface PRUbicacionesResult {
  ubicacion: string | null;
}

interface PRDatosPredioResult {
  situacion: string | null;
  tipoedifica: string | null;
  uso: string | null;
  condicion: string | null;
  n0500areaterreno: number | null;
}

interface PRGrupoTierraResult {
  grupotierra: string | null;
  codgategoria: string | null;
  valorunit: number | null;
  area: number | null;
  valorterreno: number | null;
}

interface PRConstruccionesResult {
  c0501numpiso: string | null;
  mepdesc: string | null;
  escdesc: string | null;
  ant: number | null;
  categorias: string | null;
  valorunitario: number | null;
  incr: string | null;
  depreciacion: number | null;
  valorunitdepreciado: number | null;
  areaconstruida: number | null;
  valorconstruccion: number | null;
}

export function generatePR(
  prResult: PRResult[],
  prReportResult: PRReportResult[],
  prTitularesResult: PRTitularesResult[],
  prUbicacionesResult: PRUbicacionesResult[],
  prDatosPredioResult: PRDatosPredioResult[],
  prGrupoTierraResult: PRGrupoTierraResult[],
  prConstruccionesResult: PRConstruccionesResult[]
) {
  // Initialize PDF in A5 format with reduced margins
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Adjusted font sizes
  const titleFont = 10;
  const subtitleFont = 8;
  const baseFont = 6;
  const smallFont = 5;
  const tinyFont = 4.5;

  // Adjusted page margins
  const leftMargin = 8;
  const rightMargin = 8;
  const pageWidth = 148; // A5 width
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // Header section - more compact
  doc.setFontSize(titleFont);
  doc.text("DECLARACIÓN JURADA DEL", pageWidth / 2, 12, { align: "center" });
  doc.text("IMPUESTO PREDIAL", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(subtitleFont);
  doc.text("PREDIO RURAL", pageWidth / 2, 24, { align: "center" });
  doc.text("PR", pageWidth / 2, 30, { align: "center" });

  // Right header - adjusted position
  doc.text("ESPECIE VALORADA", 110, 12);
  doc.text("PREDIO RURAL", 110, 18);

  // Document info boxes - more compact
  const boxWidth = contentWidth / 3;
  doc.rect(leftMargin, 35, boxWidth - 2, 10);
  doc.rect(leftMargin + boxWidth, 35, boxWidth - 2, 10);
  doc.rect(leftMargin + 2 * boxWidth, 35, boxWidth - 2, 10);

  doc.setFontSize(baseFont);
  doc.text("EJERCICIO FISCAL", leftMargin + 2, 39);
  doc.text(
    prReportResult[0]?.c0508anio_bd?.toString() ?? "",
    leftMargin + 2,
    43
  );

  doc.text("UNIDAD CATASTRAL", leftMargin + boxWidth + 2, 39);
  doc.text(
    prReportResult[0]?.c0508id_uni_cat_bd ?? "",
    leftMargin + boxWidth + 2,
    43
  );

  doc.text("N° DE REFERENCIA:", leftMargin + 2 * boxWidth + 2, 39);
  doc.text(
    prReportResult[0]?.c0508numpr_bd ?? "",
    leftMargin + 2 * boxWidth + 2,
    43
  );

  // Taxpayer information - more compact
  doc.rect(leftMargin, 47, contentWidth, 12);
  doc.text("DATOS DEL CONTRIBUYENTE", leftMargin + 2, 51);
  doc.setFontSize(smallFont);
  doc.text("APELLIDOS Y NOMBRES / RAZÓN SOCIAL", leftMargin + 2, 55);
  doc.text(prTitularesResult[0]?.nombre_bd ?? "", leftMargin + 2, 58);
  doc.text("DNI / CIP / RUC", leftMargin + contentWidth * 0.6, 55);
  doc.text(
    prTitularesResult[0]?.numero_bd ?? "",
    leftMargin + contentWidth * 0.6,
    58
  );
  doc.text("CÓDIGO", leftMargin + contentWidth * 0.8, 55);
  doc.text(prResult[0]?.codcont ?? "", leftMargin + contentWidth * 0.8, 58);

  // Property location - more compact
  doc.rect(leftMargin, 61, contentWidth, 10);
  doc.setFontSize(baseFont);
  doc.text("UBICACIÓN DEL PREDIO", leftMargin + 2, 65);
  doc.setFontSize(tinyFont);
  doc.text(prUbicacionesResult[0]?.ubicacion ?? "", leftMargin + 2, 69, {
    maxWidth: contentWidth - 4,
  });

  // Property details table - more compact
  doc.rect(leftMargin, 73, contentWidth, 15);
  doc.setFontSize(baseFont);
  doc.text("DATOS RELATIVOS DEL PREDIO", leftMargin + 2, 77);

  // Adjusted column widths
  const colWidths = [
    contentWidth * 0.2,
    contentWidth * 0.2,
    contentWidth * 0.2,
    contentWidth * 0.2,
    contentWidth * 0.2,
  ];

  let xPos = leftMargin;
  const tableY = 79;

  // Draw vertical lines
  colWidths.forEach((width) => {
    doc.line(xPos, tableY, xPos, tableY + 9);
    xPos += width;
  });
  doc.line(xPos, tableY, xPos, tableY + 9);

  // Headers
  doc.setFontSize(tinyFont);
  xPos = leftMargin;
  [
    "SITUACIÓN DE LA UNIDAD",
    "TIPO DE EDIFICACIÓN",
    "USO",
    "CONDICIÓN DE PROPIEDAD",
    "AREA TERRENO (HA)",
  ].forEach((header, i) => {
    doc.text(header, xPos + 1, tableY + 3, {
      maxWidth: colWidths[i] - 2,
    });
    xPos += colWidths[i];
  });

  // Data
  xPos = leftMargin;
  [
    prDatosPredioResult[0]?.situacion ?? "",
    prDatosPredioResult[0]?.tipoedifica ?? "",
    prDatosPredioResult[0]?.uso ?? "",
    prDatosPredioResult[0]?.condicion ?? "",
    (prDatosPredioResult[0]?.n0500areaterreno ?? "").toString(),
  ].forEach((value, i) => {
    doc.text(value, xPos + 1, tableY + 7, {
      maxWidth: colWidths[i] - 2,
    });
    xPos += colWidths[i];
  });

  // Land groups table - more compact
  const landTableY = 90;
  doc.rect(leftMargin, landTableY, contentWidth, 30);
  doc.setFontSize(baseFont);
  doc.text("GRUPO DE TIERRA", leftMargin + 2, landTableY + 4);

  // Adjusted column widths for land groups
  const landColWidths = [
    contentWidth * 0.05, // N°
    contentWidth * 0.25, // GRUPO DE TIERRA
    contentWidth * 0.2, // CATEGORÍA
    contentWidth * 0.2, // ARANCEL S/
    contentWidth * 0.15, // ÁREA (HA)
    contentWidth * 0.15, // VALOR DEL TERRENO S/
  ];

  // Draw land table grid
  xPos = leftMargin;
  landColWidths.forEach((width) => {
    doc.line(xPos, landTableY + 6, xPos, landTableY + 30);
    xPos += width;
  });
  doc.line(xPos, landTableY + 6, xPos, landTableY + 30);
  doc.line(
    leftMargin,
    landTableY + 6,
    leftMargin + contentWidth,
    landTableY + 6
  );

  // Land headers
  doc.setFontSize(tinyFont);
  xPos = leftMargin;
  [
    "N°",
    "GRUPO DE TIERRA",
    "CATEGORÍA",
    "ARANCEL S/",
    "ÁREA (HA)",
    "VALOR DEL TERRENO S/",
  ].forEach((header, i) => {
    doc.text(header, xPos + 1, landTableY + 9, {
      maxWidth: landColWidths[i] - 2,
    });
    xPos += landColWidths[i];
  });

  // Land data
  if (prGrupoTierraResult.length > 0) {
    prGrupoTierraResult.forEach((item, index) => {
      xPos = leftMargin;
      [
        (index + 1).toString(),
        item.grupotierra ?? "",
        item.codgategoria ?? "",
        Number(item.valorunit ?? 0).toLocaleString("es-PE", {
          minimumFractionDigits: 2,
        }),
        Number(item.area ?? 0).toFixed(2),
        Number(item.valorterreno ?? 0).toLocaleString("es-PE", {
          minimumFractionDigits: 2,
        }),
      ].forEach((cell, i) => {
        doc.text(cell, xPos + 1, landTableY + 13 + index * 4, {
          maxWidth: landColWidths[i] - 2,
        });
        xPos += landColWidths[i];
      });
    });
  }

  // Construction characteristics table - more compact
  const constTableY = 122;
  doc.rect(leftMargin, constTableY, contentWidth, 35);
  doc.setFontSize(baseFont);
  doc.text("CARACTERÍSTICAS DE CONSTRUCCIÓN", leftMargin + 2, constTableY + 4);

  // Adjusted column widths for construction
  const constColWidths = [
    contentWidth * 0.07, // PISO
    contentWidth * 0.1, // MATERIAL
    contentWidth * 0.1, // E.CONSERV
    contentWidth * 0.07, // ANT
    contentWidth * 0.1, // CATEGORÍA
    contentWidth * 0.1, // VAL.UNIT
    contentWidth * 0.08, // %INCR
    contentWidth * 0.1, // DEPREC
    contentWidth * 0.1, // V.UNIT.DEP
    contentWidth * 0.09, // ÁREA
    contentWidth * 0.09, // VALOR CONST
  ];

  // Draw construction table grid
  xPos = leftMargin;
  constColWidths.forEach((width) => {
    doc.line(xPos, constTableY + 6, xPos, constTableY + 35);
    xPos += width;
  });
  doc.line(xPos, constTableY + 6, xPos, constTableY + 35);
  doc.line(
    leftMargin,
    constTableY + 6,
    leftMargin + contentWidth,
    constTableY + 6
  );

  // Construction headers
  doc.setFontSize(tinyFont);
  xPos = leftMargin;
  [
    "PISO",
    "MATERIAL",
    "E.CONSERV",
    "ANT.",
    "CATEGORÍA",
    "VAL.UNIT",
    "%INCR.",
    "DEPREC",
    "V.UNIT.DEP",
    "ÁREA CONSTR.",
    "VALOR CONST.",
  ].forEach((header, i) => {
    doc.text(header, xPos + 1, constTableY + 9, {
      maxWidth: constColWidths[i] - 2,
    });
    xPos += constColWidths[i];
  });

  // Construction data
  if (prConstruccionesResult.length > 0) {
    prConstruccionesResult.forEach((item, index) => {
      xPos = leftMargin;
      [
        item.c0501numpiso ?? "",
        item.mepdesc ?? "",
        item.escdesc ?? "",
        Number(item.ant ?? 0).toString(),
        item.categorias ?? "",
        Number(item.valorunitario ?? 0).toFixed(2),
        item.incr ?? "",
        Number(item.depreciacion ?? 0).toFixed(2),
        Number(item.valorunitdepreciado ?? 0).toFixed(2),
        Number(item.areaconstruida ?? 0).toFixed(2),
        Number(item.valorconstruccion ?? 0).toFixed(2),
      ].forEach((cell, i) => {
        doc.text(cell, xPos + 1, constTableY + 13 + index * 4, {
          maxWidth: constColWidths[i] - 2,
        });
        xPos += constColWidths[i];
      });
    });
  }

  // Other installations table
  const otherInstTableY = constTableY + 37; // Position after construction table
  doc.rect(leftMargin, otherInstTableY, contentWidth, 20);
  doc.setFontSize(baseFont);
  doc.text("OTRAS INSTALACIONES", leftMargin + 2, otherInstTableY + 4);

  // Adjusted column widths for other installations
  const otherInstColWidths = [
    contentWidth * 0.06, // COD
    contentWidth * 0.09, // MATERIAL
    contentWidth * 0.09, // E.CONSERV
    contentWidth * 0.06, // ANT
    contentWidth * 0.15, // DESCRIPCIÓN
    contentWidth * 0.11, // METRADO
    contentWidth * 0.11, // VAL.UNIT
    contentWidth * 0.11, // DEPREC
    contentWidth * 0.11, // V.UNIT.DEP
    contentWidth * 0.11, // VALOR OTRAS INSTALACIONES
  ];

  // Draw other installations table grid
  xPos = leftMargin;
  otherInstColWidths.forEach((width) => {
    doc.line(xPos, otherInstTableY + 6, xPos, otherInstTableY + 20);
    xPos += width;
  });
  doc.line(xPos, otherInstTableY + 6, xPos, otherInstTableY + 20);
  doc.line(
    leftMargin,
    otherInstTableY + 6,
    leftMargin + contentWidth,
    otherInstTableY + 6
  );

  // Headers for other installations
  doc.setFontSize(tinyFont);
  xPos = leftMargin;
  [
    "COD.",
    "MATERIAL",
    "E.CONSERV",
    "ANT.",
    "DESCRIPCIÓN",
    "METRADO",
    "VAL.UNIT",
    "DEPREC",
    "V.UNIT.DEP",
    "VALOR OTRAS INSTALA.",
  ].forEach((header, i) => {
    doc.text(header, xPos + 1, otherInstTableY + 9, {
      maxWidth: otherInstColWidths[i] - 2,
    });
    xPos += otherInstColWidths[i];
  });

  // Adjust the starting Y position for the final values section
  const valueTableY = otherInstTableY + 22;

  // Final values section - more compact
  doc.rect(leftMargin, valueTableY, contentWidth, 18);
  doc.setFontSize(baseFont);
  doc.text(
    "DETERMINACIÓN DEL VALOR DEL PREDIO (S/.)",
    leftMargin + 2,
    valueTableY + 4
  );

  // Value columns
  const valueColWidth = contentWidth / 4;

  // VALOR DEL TERRENO
  doc.text("VALOR DEL", leftMargin + 2, valueTableY + 8);
  doc.text("TERRENO", leftMargin + 2, valueTableY + 11);
  doc.text(
    Number(prReportResult[0]?.n0508valorterreno_bd ?? 0).toLocaleString(
      "es-PE",
      {
        minimumFractionDigits: 2,
      }
    ),
    leftMargin + 2,
    valueTableY + 15
  );

  // VALOR CONSTRUC
  doc.text("+", leftMargin + valueColWidth - 5, valueTableY + 11);
  doc.text("VALOR", leftMargin + valueColWidth + 2, valueTableY + 8);
  doc.text("CONSTRUC.", leftMargin + valueColWidth + 2, valueTableY + 11);
  doc.text(
    Number(prReportResult[0]?.n0508valorconstr_bd ?? 0).toLocaleString(
      "es-PE",
      {
        minimumFractionDigits: 2,
      }
    ),
    leftMargin + valueColWidth + 2,
    valueTableY + 15
  );

  // VALOR OTR INSTAL
  doc.text("+", leftMargin + 2 * valueColWidth - 5, valueTableY + 11);
  doc.text("VALOR OTR", leftMargin + 2 * valueColWidth + 2, valueTableY + 8);
  doc.text("INSTAL.", leftMargin + 2 * valueColWidth + 2, valueTableY + 11);
  doc.text(
    Number(prReportResult[0]?.n0508valorinstalac_bd ?? 0).toLocaleString(
      "es-PE",
      {
        minimumFractionDigits: 2,
      }
    ),
    leftMargin + 2 * valueColWidth + 2,
    valueTableY + 15
  );

  // VALOR TOTAL
  doc.text("=", leftMargin + 3 * valueColWidth - 5, valueTableY + 11);
  doc.text(
    "VALOR DEL PREDIO S/.",
    leftMargin + 3 * valueColWidth + 2,
    valueTableY + 8
  );
  doc.text(
    Number(prReportResult[0]?.n0508valuototal_bd ?? 0).toLocaleString("es-PE", {
      minimumFractionDigits: 2,
    }),
    leftMargin + 3 * valueColWidth + 2,
    valueTableY + 15
  );

  // Document number at bottom
  doc.setFontSize(baseFont);
  doc.text(
    prReportResult[0]?.c0508numpr_bd ?? "",
    pageWidth - rightMargin - 20,
    202
  );

  return doc;
}
