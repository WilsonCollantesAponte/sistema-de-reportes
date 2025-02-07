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
  puConstruccionesResult: PUConstruccionesResult[] = [],
  puOtrasConstruccionesResult: PUOtrasConstruccionesResult[] = [],
  logo: Uint8Array
): jsPDF {
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Header Section - Ajustado con más espacio
  doc.addImage(logo, "JPEG", 15, 12, 18, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARACIÓN JURADA DEL", 74, 20, { align: "center" });
  doc.text("IMPUESTO PREDIAL", 74, 26, { align: "center" });

  // PU Section - Más espacio entre secciones
  doc.setFontSize(18);
  doc.text("PU", 74, 35, { align: "center" });
  doc.setFontSize(10);
  doc.text("PREDIO URBANO", 74, 42, { align: "center" });

  // Municipality Info - Mejor espaciado
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("MUNICIPALIDAD DISTRITAL VEINTISÉIS DE", 5, 32);
  doc.text("OCTUBRE", 5, 36);
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H. Las", 5, 40);
  doc.text("Capullanas - Veintiseis de Octubre", 5, 44);
  doc.text("RUC:20529997401", 5, 48);

  // Starting position for content
  const boxY = 52;

  // Fiscal Year box
  doc.rect(5, boxY, 45, 10);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("EJERCICIO FISCAL", 27.5, boxY + 4, { align: "center" });

  if (puReportResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(puReportResult[0].c0500anio || "", 27.5, boxY + 8, {
      align: "center",
    });
  }

  // Main cadastral unit box - Reduced width
  doc.rect(55, boxY, 44, 10);
  doc.setFont("helvetica", "bold");
  doc.text("UNIDAD CATASTRAL", 77, boxY + 4, { align: "center" });

  if (puReportResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(puReportResult[0].c0500id_uni_cat || "", 77, boxY + 8, {
      align: "center",
    });
  }

  // Single container for page number, reference and date
  doc.rect(102, boxY, 41, 10);
  doc.setFontSize(5);
  // Page number
  // doc.text("Pag 1 de 1", 104, boxY + 3);

  doc.setFontSize(7);
  doc.text("Pag 1 de 1", 122, 36);
  doc.setFontSize(5);

  // Reference number
  if (puResult.length > 0) {
    doc.text(`N° DE REFERENCIA: ${puResult[0].numpu || ""}`, 104, boxY + 4);
  }
  // Date
  if (puReportResult.length > 0) {
    const fecha = new Date(puReportResult[0].fecha || "");
    doc.text(`FECHA DE EMISIÓN: ${fecha.toLocaleDateString()}`, 104, boxY + 7);
  }

  // Taxpayer Data Section
  const contribuyenteY = boxY + 15;
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CONTRIBUYENTE", 5, contribuyenteY);

  // Taxpayer box
  doc.rect(5, contribuyenteY + 2, 138, 8);
  doc.rect(5, contribuyenteY + 5.4, 138, 0);
  doc.setFontSize(5);
  doc.text("APELLIDOS Y NOMBRES / RAZÓN SOCIAL", 7, contribuyenteY + 4.5);
  doc.text("DNI / CIP / RUC", 95, contribuyenteY + 4.5);
  doc.text("CÓDIGO", 120, contribuyenteY + 4.5);

  if (puTitularesResult.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(
      puTitularesResult[0].nombre_bd?.trim() || "",
      7,
      contribuyenteY + 8
    );
    doc.text(
      puTitularesResult[0].numero_bd?.trim() || "",
      95,
      contribuyenteY + 8
    );
    doc.text(puTitularesResult[0].id_persona_bd || "", 120, contribuyenteY + 8);
  }

  // Adjust the following datosY to account for the new section
  const datosY = contribuyenteY + 15;

  // DATOS RELATIVOS DEL PREDIO - Completamente reformateado
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS RELATIVOS DEL PREDIO", 5, datosY);

  // Ubicación del predio - Nueva estructura con 4 columnas
  doc.rect(5, datosY + 2, 138, 15);

  // Headers de las columnas
  doc.setFontSize(5);
  doc.text("UBICACIÓN DEL PREDIO", 7, datosY + 5);
  doc.text("USO", 65, datosY + 5);
  doc.text("CONDICIÓN DE PROPIEDAD", 95, datosY + 5);
  doc.text("%PROPIEDAD", 130, datosY + 5);

  // Datos de las columnas usando los parámetros
  doc.setFont("helvetica", "normal");
  if (puUbicacionesResult.length > 0) {
    doc.text(puUbicacionesResult[0].ubicacion?.trim() || "", 7, datosY + 9);
  }
  if (puDatosPredioResult.length > 0) {
    doc.text(puDatosPredioResult[0].desc_uso?.trim() || "", 65, datosY + 9);
    doc.text(
      puDatosPredioResult[0].condicion_pro?.trim() || "",
      95,
      datosY + 9
    );
    const porcentaje = Number(puDatosPredioResult[0].n0500porctit || 0).toFixed(
      3
    );
    doc.text(`${porcentaje}`, 130, datosY + 9);
  }

  // Área de terreno y valores
  const terrenoY = datosY + 20;
  doc.rect(5, terrenoY, 65, 8);
  doc.rect(70, terrenoY, 40, 8);
  doc.rect(110, terrenoY, 33, 8);

  doc.setFont("helvetica", "bold");
  doc.text("ÁREA DE TERRENO (m2)", 7, terrenoY + 3);
  doc.text("ARANCEL", 72, terrenoY + 3);
  doc.text("VALOR DE TERRENO S/.", 112, terrenoY + 3);

  // Datos usando los parámetros
  if (puDatosPredioResult.length > 0) {
    const datos = puDatosPredioResult[0];
    doc.setFont("helvetica", "normal");
    doc.text(Number(datos.n0500areaterreno || 0).toFixed(2), 65, terrenoY + 7, {
      align: "right",
    });
    doc.text(Number(datos.n0500arancel || 0).toFixed(2), 105, terrenoY + 7, {
      align: "right",
    });
    doc.text(
      Number(datos.n0500valorterreno || 0).toFixed(2),
      138,
      terrenoY + 7,
      { align: "right" }
    );
  }

  // Construction Characteristics Section
  const tableY = terrenoY + 15;
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("CARACTERÍSTICAS DE CONSTRUCCIÓN", 5, tableY - 2);

  // Marco principal
  doc.rect(5, tableY, 138, 18);

  // Líneas verticales principales
  const colX = [5, 15, 30, 45, 60, 70, 80, 90, 100, 110, 120, 130, 143];
  colX.forEach((x) => {
    doc.line(x, tableY, x, tableY + 18);
  });

  // Línea horizontal que separa encabezados
  doc.line(5, tableY + 7, 143, tableY + 7);

  // Encabezados
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("PISO", 7, tableY + 5);
  doc.text("MATERIAL\nESTRUCTURAL", 17, tableY + 4);
  doc.text("ESTADO DE\nCONSERVACIÓN", 32, tableY + 4);
  doc.text("SITUACIÓN DE\nLA UNIDAD", 47, tableY + 4);
  doc.text("ANTIGÜEDAD", 60, tableY + 5);
  doc.text("CATEGORÍAS", 70, tableY + 5);
  doc.text("VALOR\nUNITARIO\nM2", 82, tableY + 2);
  doc.text("%INCREMENTO", 90, tableY + 4);
  doc.text("VALOR DEPRECIADO", 110, tableY - 0.5);
  doc.text("%", 107, tableY + 4);
  doc.text("VALOR S/.", 112, tableY + 4);
  doc.text("ÁREA\nCONSTR.", 122, tableY + 4);
  doc.text("VALOR\nCONSTRUCCIÓN\n(VC)", 131, tableY + 2);

  // Datos de construcción usando los parámetros
  if (puConstruccionesResult.length > 0) {
    const construccion = puConstruccionesResult[0];
    doc.setFont("helvetica", "normal");
    doc.text(construccion.c0501numpiso || "", 8, tableY + 13);
    doc.text(construccion.mepdesc || "", 17, tableY + 13);
    doc.text(construccion.escdesc || "", 32, tableY + 13);
    doc.text("TERMINADO", 47, tableY + 13);
    doc.text(String(construccion.ant || ""), 63, tableY + 13);
    doc.text("C C F", 72, tableY + 13);
    doc.text(
      Number(construccion.valorunitario || 0).toFixed(2),
      82,
      tableY + 13
    );
    doc.text("0.00", 92, tableY + 13);
    // Cálculo del valor depreciado
    const valorDepreciado = Number(construccion.valorunitario || 0) * 0.16; // 16%
    doc.text("16.00", 102, tableY + 13);
    doc.text(valorDepreciado.toFixed(2), 112, tableY + 13);
    doc.text(
      Number(construccion.areaconstruida || 0).toFixed(2),
      122,
      tableY + 13
    );
    doc.text(
      Number(construccion.valorconstruccion || 0).toFixed(2),
      132,
      tableY + 13
    );
  }

  // Total de construcción
  doc.line(5, tableY + 18, 143, tableY + 18);
  doc.text("Total:", 115, tableY + 22);
  if (puConstruccionesResult.length > 0) {
    const totalConstruccion = Number(
      puConstruccionesResult[0].valorconstruccion || 0
    );
    doc.text(totalConstruccion.toFixed(2), 140, tableY + 22, {
      align: "right",
    });
  }

  // VAC box
  doc.rect(5, tableY + 24, 138, 6);
  doc.text("VALOR DE AREAS COMUNES S/ (VAC)", 7, tableY + 28);
  doc.text("0", 140, tableY + 28, { align: "right" });

  // Otras Instalaciones
  const otrasY = tableY + 35;
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("OTRAS INSTALACIONES", 5, otrasY - 2);

  // Marco principal
  doc.rect(5, otrasY, 138, 18);

  // Líneas verticales
  const colX2 = [5, 20, 35, 50, 65, 95, 105, 115, 125, 143];
  colX2.forEach((x) => {
    doc.line(x, otrasY, x, otrasY + 18);
  });

  // Línea horizontal para encabezados
  doc.line(5, otrasY + 7, 143, otrasY + 7);

  // Otras Instalaciones headers
  doc.text("VALOR DEPRECIADO", 115, otrasY - 0.5);
  doc.text("%", 117, otrasY + 4);
  doc.text("VALOR S/", 128, otrasY + 7, { angle: 90 });

  // Add vertical line between VALOR S/. and VALOR DE OBRAS
  doc.line(130, otrasY, 130, otrasY + 18);

  // Rotate text for VALOR DE OBRAS
  doc.setFontSize(3);
  doc.text(
    "VALOR DE OBRAS\nCOMPLEMENTARIAS Y/O\nINSTALACIONES\nFIJAS Y PERMANENTES\nS/. (VOI)",
    130.11,
    otrasY + 1.5
  );

  // Encabezados
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  doc.text("CÓDIGO", 7, otrasY + 5);
  doc.text("MATERIAL", 22, otrasY + 5);
  doc.text("ESTADO DE\nCONSERVACIÓN", 37, otrasY + 4);
  doc.text("ANTIGÜEDAD", 52, otrasY + 5);
  doc.text("DESCRIPCIÓN", 75, otrasY + 5);
  doc.text("METRADO", 97, otrasY + 5);
  doc.text("VALOR\nUNITARIOS\nM2", 106, otrasY + 2);

  // Datos de otras instalaciones usando los parámetros
  if (puOtrasConstruccionesResult.length > 0) {
    const otras = puOtrasConstruccionesResult[0];
    doc.setFont("helvetica", "normal");
    doc.text(otras.cod || "", 7, otrasY + 13);
    doc.text(otras.c0502mep || "", 22, otrasY + 13);
    doc.text(otras.mepdesc || "", 37, otrasY + 13);
    doc.text(String(otras.ant || ""), 52, otrasY + 13);
    doc.text(otras.descripcion || "", 67, otrasY + 13);
    doc.text(Number(otras.n0500prod_total || 0).toFixed(2), 97, otrasY + 13);
    doc.text(Number(otras.valorunitario || 0).toFixed(2), 107, otrasY + 13);
    const depreciacion = Number(otras.depreciacion || 0).toFixed(2);
    doc.text(depreciacion, 117, otrasY + 13);
    doc.text(Number(otras.valordepreciado || 0).toFixed(2), 127, otrasY + 13);
    doc.text(Number(otras.valor || 0).toFixed(2), 132, otrasY + 13);
  }

  // Total otras instalaciones
  doc.line(5, otrasY + 18, 143, otrasY + 18);
  doc.text("Total:", 115, otrasY + 22);
  if (puOtrasConstruccionesResult.length > 0) {
    const totalOtras = Number(puOtrasConstruccionesResult[0].valor || 0);
    doc.text(totalOtras.toFixed(2), 140, otrasY + 22, { align: "right" });
  }

  // Value Determination Section
  const determY = otrasY + 30;
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DETERMINACIÓN DEL VALOR DEL PREDIO (S/.)", 5, determY);

  const boxY2 = determY + 2;

  // Cálculos usando los parámetros
  if (puReportResult.length > 0) {
    const report = puReportResult[0];
    const valuoTotal = Number(report.n0500valuototal || 0);
    const porcentaje = Number(report.n0500porctit || 0);
    const valorAfecto = (valuoTotal * porcentaje) / 100;

    // First Box
    doc.rect(5, boxY2, 40, 12);
    doc.setFontSize(5);
    doc.text("VALUO TOTAL DEL PREDIO (VT\n+VC + VOI +VAC)", 7, boxY2 + 4);
    doc.text(valuoTotal.toFixed(2), 43, boxY2 + 10, { align: "right" });

    doc.setFontSize(10);
    doc.text("X", 47, boxY2 + 7);

    // Second Box
    doc.rect(55, boxY2, 40, 12);
    doc.setFontSize(5);
    doc.text("% PROPIEDAD", 57, boxY2 + 4);
    doc.text(`${porcentaje.toFixed(3)}%`, 93, boxY2 + 10, { align: "right" });

    doc.setFontSize(10);
    doc.text("=", 97, boxY2 + 7);

    // Third Box
    doc.rect(105, boxY2, 40, 12);
    doc.setFontSize(5);
    doc.text("VALUO DEL PREDIO AFECTO", 107, boxY2 + 4);
    doc.text(valorAfecto.toFixed(2), 143, boxY2 + 10, { align: "right" });
  }

  // Número de serie
  doc.setFontSize(7);
  doc.text("030496", 132, determY + 20);

  return doc;
}
