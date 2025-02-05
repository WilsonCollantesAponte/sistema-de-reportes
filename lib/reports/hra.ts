import { jsPDF } from "jspdf";

interface HraResult {
  numhra: string;
  codcont: string;
}

interface HraHojaResumenResult {
  c0507codcont_bd: string;
  c0001nombre_bd: string;
  c0507anio_bd: string;
  c0507numhra_bd: string;
  c0507idlugar_bd: string;
  c0507codvia_bd: string;
  c0507numemuni_bd: string;
  c0507manzana_bd: string;
  c0507lote_bd: string;
  c0507piso_bd: string;
  n0507limpieza_bd: number;
  n0507areasverdes_bd: number;
  n0507serenazgo_bd: number;
  c0507mesi_bd: string;
  c0507mesf_bd: string;
  n0507numpredios_bd: number;
  n0507arbitriototal_bd: number;
  n0507arbitrioredond_bd: number;
  n0507gastos_bd: number;
  c0507usuario_bd: string;
  d0507fecha_bd: Date;
  usariomod_bd: string;
  cobservacion_bd: string;
  tipotabla_bd: string;
  numpaquete: string;
}

interface HraTitularesResult {
  id_persona_bd: string;
  nombre_bd: string;
  abrev_bd: string;
  numero_bd: string;
}

interface HraDomiciliosResult {
  domicilio: string;
}

interface HraPrediosResult {
  c0500id_uni_cat: string;
  ubicacion: string;
  n0500porctit: number;
  limpiezaredond: number;
  areasverdesredond: number;
  serenazgoredond: number;
  gastoemision: number;
}

interface TotalArbitriosMunicipales {
  totalArbitriosMunicipales: string;
}

export function generateHRA(
  hraResult: HraResult[],
  hraHojaResumenResult: HraHojaResumenResult[],
  hraTitularesResult: HraTitularesResult[],
  hraDomiciliosResult: HraDomiciliosResult[],
  hraPrediosResult: HraPrediosResult[],
  totalArbitriosMunicipales: TotalArbitriosMunicipales
) {
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Font sizes más pequeños
  const titleFont = 9;
  const normalFont = 7;
  const smallFont = 5;
  const margin = 8; // Margen reducido
  const pageWidth = 148; // A5 width
  const contentWidth = pageWidth - 2 * margin;

  // Header section - aún más compacto
  doc.setFontSize(titleFont);
  doc.rect(margin, margin, 20, 15); // Logo más pequeño

  // Título principal más compacto
  doc.text("HOJA DE RESUMEN DETERMINACIÓN", pageWidth / 2, margin + 5, {
    align: "center",
  });
  doc.text("DE ARBITRIOS MUNICIPALES", pageWidth / 2, margin + 9, {
    align: "center",
  });

  // Información municipal más compacta
  doc.setFontSize(normalFont);
  doc.text("MUNICIPALIDAD DISTRITAL VEINTISÉIS", margin, margin + 20);
  doc.text("DE OCTUBRE", margin, margin + 23);
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H.", margin, margin + 26);
  doc.text("Las Capullanas - Veintiséis de Octubre", margin, margin + 29);

  // HRA grande en el centro
  doc.setFontSize(titleFont * 1.8);
  doc.text("HRA", pageWidth / 2, margin + 27, { align: "center" });

  // Número de página
  doc.setFontSize(normalFont);
  doc.text("Pág 1 de 1", pageWidth - margin - 15, margin + 5);

  // Cuadros de ejercicio fiscal y determinación - más compactos
  const boxY = margin + 32;

  // Ejercicio Fiscal
  doc.rect(margin, boxY, contentWidth / 2 - 5, 10);
  doc.setFontSize(normalFont);
  doc.rect(margin, boxY, contentWidth / 2 - 5, 4);
  doc.text("EJERCICIO FISCAL", margin + 2, boxY + 3);
  doc.text(
    hraHojaResumenResult[0]?.c0507anio_bd ?? "",
    margin + contentWidth / 4 - 10,
    boxY + 8
  );

  // Determinación
  doc.rect(margin + contentWidth / 2, boxY, contentWidth / 2, 10);
  doc.rect(margin + contentWidth / 2, boxY, contentWidth / 2, 4);
  doc.text("N° DETERMINACIÓN:", margin + contentWidth / 2 + 2, boxY + 3);
  doc.text(hraResult[0]?.numhra ?? "", margin + contentWidth / 2 + 2, boxY + 8);
  doc.text("FECHA DE EMISIÓN:", margin + contentWidth / 2 + 30, boxY - 2);
  doc.text(
    hraHojaResumenResult[0]?.d0507fecha_bd?.toLocaleDateString() ?? "",
    margin + contentWidth / 2 + 25 + 30,
    boxY - 2
  );

  // Datos del contribuyente - más compacto
  const contribY = boxY + 12;
  doc.rect(margin, contribY, contentWidth, 15);
  doc.text("DATOS DEL CONTRIBUYENTE", margin + 2, contribY + 3);

  // Tabla contribuyente
  doc.rect(margin, contribY + 4, contentWidth, 4);
  doc.text("APELLIDOS Y NOMBRES / RAZÓN SOCIAL", margin + 2, contribY + 7);
  doc.text("DNI / CIP / RUC", pageWidth - margin - 60, contribY + 7);
  doc.text("CÓDIGO", pageWidth - margin - 20, contribY + 7);

  doc.text(hraTitularesResult[0]?.nombre_bd ?? "", margin + 2, contribY + 12);
  doc.text(
    hraTitularesResult[0]?.numero_bd ?? "",
    pageWidth - margin - 60,
    contribY + 12
  );
  doc.text(hraResult[0]?.codcont ?? "", pageWidth - margin - 20, contribY + 12);

  // Domicilio fiscal - más compacto
  const domicilioY = contribY + 17;
  doc.rect(margin, domicilioY, contentWidth, 12);
  doc.rect(margin, domicilioY, contentWidth, 4);
  doc.text("DOMICILIO FISCAL", margin + 2, domicilioY + 3);
  doc.text(hraDomiciliosResult[0]?.domicilio ?? "", margin + 2, domicilioY + 8);

  // Predios declarados con texto ajustado
  const prediosY = domicilioY + 14;
  doc.setFontSize(normalFont);
  doc.text("RELACIÓN DE", margin, prediosY + 3);
  doc.text("PREDIOS DECLARADOS", margin, prediosY + 7);

  // Tabla de predios con texto ajustado
  const tableY = prediosY + 9;
  doc.rect(margin, tableY, contentWidth, 30);

  // Encabezados principales
  const headerY = tableY;
  const arbitriosWidth = contentWidth * 0.4;
  const colWidths = {
    unidadCatastral: contentWidth * 0.2,
    arbitrios: arbitriosWidth,
    totalPredio: contentWidth * 0.15,
    gastos: contentWidth * 0.1,
    totalFinal: contentWidth * 0.15,
  };

  let xPos = margin;
  doc.setFontSize(smallFont);

  // Primer nivel de encabezados con saltos de línea
  doc.rect(xPos, headerY, colWidths.unidadCatastral, 8);
  doc.text("UNIDAD\nCATASTRAL", xPos + 1, headerY + 3, {
    lineHeightFactor: 0.8,
  });
  xPos += colWidths.unidadCatastral;

  doc.rect(xPos, headerY, colWidths.arbitrios, 8);
  doc.text(
    "DETERMINACIÓN ANUAL DE\nARBITRIOS MUNICIPALES",
    xPos + 1,
    headerY + 3,
    { lineHeightFactor: 0.8 }
  );
  xPos += colWidths.arbitrios;

  doc.rect(xPos, headerY, colWidths.totalPredio, 8);
  doc.text(
    "TOTAL ARBITRIOS\nMUNICIPALES POR\nPREDIO S/",
    xPos + 1,
    headerY + 3,
    { lineHeightFactor: 0.8 }
  );
  xPos += colWidths.totalPredio;

  doc.rect(xPos, headerY, colWidths.gastos, 8);
  doc.text("GASTOS DE\nEMISION S/", xPos + 1, headerY + 3, {
    lineHeightFactor: 0.8,
  });
  xPos += colWidths.gastos;

  doc.rect(xPos, headerY, colWidths.totalFinal, 8);
  doc.text(
    "TOTAL ARBITRIOS\nMUNICIPALES POR\nPREDIO S/",
    xPos + 1,
    headerY + 3,
    { lineHeightFactor: 0.8 }
  );

  // Subencabezados de arbitrios
  const subHeaderY = headerY + 8;
  xPos = margin + colWidths.unidadCatastral;
  const arbitrioWidth = colWidths.arbitrios / 3;
  ["LIMPIEZA PUBLICA", "PARQUE Y AREAS\nVERDES", "SERENAZGO"].forEach(
    (text) => {
      doc.rect(xPos, subHeaderY, arbitrioWidth, 6);
      doc.text(text, xPos + 1, subHeaderY + 4);
      xPos += arbitrioWidth;
    }
  );

  // Datos de predios
  if (hraPrediosResult.length > 0) {
    const dataY = subHeaderY + 6;
    hraPrediosResult.forEach((predio, index) => {
      const rowY = dataY + index * 5;
      xPos = margin;

      const limpiezaNum = Number(predio.limpiezaredond ?? 0);
      const areasverdesNum = Number(predio.areasverdesredond ?? 0);
      const serenazgoNum = Number(predio.serenazgoredond ?? 0);
      const gastosNum = Number(predio.gastoemision ?? 0);
      const totalPredio = limpiezaNum + areasverdesNum + serenazgoNum;
      const totalWithGastos = totalPredio + gastosNum;

      // Unidad Catastral
      doc.rect(xPos, rowY, colWidths.unidadCatastral, 5);
      doc.text(predio.c0500id_uni_cat ?? "", xPos + 1, rowY + 3.5);
      xPos += colWidths.unidadCatastral;

      // Arbitrios
      [limpiezaNum, areasverdesNum, serenazgoNum].forEach((value) => {
        doc.rect(xPos, rowY, arbitrioWidth, 5);
        doc.text(value.toFixed(2), xPos + 1, rowY + 3.5);
        xPos += arbitrioWidth;
      });

      // Total Predio
      doc.rect(xPos, rowY, colWidths.totalPredio, 5);
      doc.text(totalPredio.toFixed(2), xPos + 1, rowY + 3.5);
      xPos += colWidths.totalPredio;

      // Gastos
      doc.rect(xPos, rowY, colWidths.gastos, 5);
      doc.text(gastosNum.toFixed(2), xPos + 1, rowY + 3.5);
      xPos += colWidths.gastos;

      // Total Final
      doc.rect(xPos, rowY, colWidths.totalFinal, 5);
      doc.text(totalWithGastos.toFixed(2), xPos + 1, rowY + 3.5);
    });
  }

  // Liquidación anual
  const liquidacionY = tableY + 33;
  doc.setFontSize(normalFont);
  doc.text(
    "LIQUIDACIÓN ANUAL A PAGAR POR ARBITRIOS MUNICIPALES S/",
    margin,
    liquidacionY
  );

  // Tabla de liquidación anual
  const liquidacionTableY = liquidacionY + 2;
  const liquidacionHeaders = [
    ["N° PREDIOS", contentWidth * 0.1],
    ["TOTAL ARBITRIOS\nMUNICIPALES", contentWidth * 0.2],
    ["GASTOS DE EMISION S/", contentWidth * 0.2],
    ["TOTAL A PAGAR ANUAL\nCON REDONDEO S/", contentWidth * 0.25],
    ["TOTAL A PAGAR ANUAL S/", contentWidth * 0.25],
  ];

  // Headers
  xPos = margin;
  doc.setFontSize(smallFont);
  liquidacionHeaders.forEach(([text, width]) => {
    doc.rect(xPos, liquidacionTableY, Number(width), 6);
    doc.text(String(text), xPos + 1, liquidacionTableY + 4);
    xPos += Number(width);
  });

  // Datos
  xPos = margin;
  const liquidacionData = [
    String(hraHojaResumenResult[0]?.n0507numpredios_bd ?? 0),
    Number(hraHojaResumenResult[0]?.n0507arbitriototal_bd ?? 0).toFixed(2),
    Number(hraHojaResumenResult[0]?.n0507gastos_bd ?? 0).toFixed(2),
    Number(hraHojaResumenResult[0]?.n0507arbitrioredond_bd ?? 0).toFixed(2),
    Number(totalArbitriosMunicipales.totalArbitriosMunicipales ?? 0).toFixed(2),
  ];

  // eslint-disable-next-line
  liquidacionHeaders.forEach(([_, width], i) => {
    doc.rect(xPos, liquidacionTableY + 6, Number(width), 6);
    doc.text(liquidacionData[i], xPos + 1, liquidacionTableY + 10);
    xPos += Number(width);
  });

  // Mensaje recordatorio
  doc.setFontSize(smallFont);
  doc.text(
    "RECUERDE: PAGANDO PUNTUALMENTE CONTRIBUYE A MEJORAR NUESTROS SERVICIOS Y AL DESARROLLO DE LA CIUDAD",
    margin,
    liquidacionTableY + 15
  );

  // Liquidación mensual
  const mensualY = liquidacionTableY + 17;
  doc.setFontSize(normalFont);
  doc.text(
    "LIQUIDACION MENSUAL A PAGAR POR ARBITRIOS MUNICIPALES (S/)",
    margin,
    mensualY
  );

  // Tabla mensual
  const mensualTableY = mensualY + 2;
  const monthWidth = contentWidth / 6;
  const totalAmount = Number(
    totalArbitriosMunicipales.totalArbitriosMunicipales ?? 0
  );
  const monthlyAmount = Number((totalAmount / 12).toFixed(2));
  const firstMonthAmount = Number(
    (
      monthlyAmount + Number(hraHojaResumenResult[0]?.n0507gastos_bd ?? 0)
    ).toFixed(2)
  );

  // Primera fila (1-6 cuotas)
  doc.setFontSize(smallFont);
  for (let i = 0; i < 6; i++) {
    const x = margin + i * monthWidth;
    doc.rect(x, mensualTableY, monthWidth, 6);
    doc.text(
      `${i + 1}° CUOTA${i === 0 ? " (*)" : ""}`,
      x + 1,
      mensualTableY + 4
    );
    doc.rect(x, mensualTableY + 6, monthWidth, 6);
    const amount = i === 0 ? firstMonthAmount : monthlyAmount;
    doc.text(amount.toFixed(2), x + 1, mensualTableY + 10);
  }

  // Segunda fila (7-12 cuotas)
  const secondRowY = mensualTableY + 12;
  for (let i = 0; i < 6; i++) {
    const x = margin + i * monthWidth;
    doc.rect(x, secondRowY, monthWidth, 6);
    doc.text(`${i + 7}° CUOTA`, x + 1, secondRowY + 4);
    doc.rect(x, secondRowY + 6, monthWidth, 6);
    doc.text(monthlyAmount.toFixed(2), x + 1, secondRowY + 10);
  }

  // Nota y número de documento
  doc.setFontSize(smallFont);
  doc.text("(*)Incluye Gastos de Emision", margin, secondRowY + 15);
  doc.text(
    hraResult[0]?.numhra ?? "",
    pageWidth - margin - 15,
    secondRowY + 15
  );

  return doc;
}
