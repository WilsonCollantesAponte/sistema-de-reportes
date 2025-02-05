import jsPDF from "jspdf";

export interface HRResult {
  numhr: string;
  codcont: string;
}

export interface HojaResumenResult {
  codcont: string;
  anio: string;
  numhr: string;
  baseimp: number;
  numpredios: number;
  impuesto: number;
  gastos: number;
  valtotal: number;
  total: number;
  fecha: Date;
  numpaquete: string;
}

export interface TitularesResult {
  id_persona_bd: string;
  nombre_bd: string;
  abrev_bd: string;
  numero_bd: string;
}

export interface DomiciliosResult {
  domicilio: string;
}

export interface PrediosResult {
  c0500id_uni_cat: string;
  ubicacion: string;
  n0500valuototal: number;
  n0500valuoinaf: number;
  n0500porctit: number;
  valor_predio: number;
}

export interface FooterResult {
  descbaseuit_bd: string;
  descbasesoles_bd: string;
  tasa_bd: number;
  base_bd: number;
  impuesto_bd: number;
  pie_bd: string;
}

export interface GenerateHRParams {
  hrResult: HRResult[];
  hojaResumenResult: HojaResumenResult[];
  titularesResult: TitularesResult[];
  domiciliosResult: DomiciliosResult[];
  prediosResult: PrediosResult[];
  footerResult: FooterResult[];
  logo: Uint8Array;
}

export const generateHR = ({
  hrResult,
  hojaResumenResult,
  titularesResult,
  domiciliosResult,
  prediosResult,
  footerResult,
  logo,
}: GenerateHRParams) => {
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Add municipal logo
  doc.addImage(logo, "JPEG", 15, 15, 20, 20);

  // Add municipality name
  doc.setFontSize(8);
  doc.text("MUNICIPALIDAD DISTRITAL", 15, 40);
  doc.text("VEINTISÉIS DE OCTUBRE", 15, 44);

  // Add header text
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARACIÓN JURADA DEL", 75, 25, { align: "center" });
  doc.text("IMPUESTO PREDIAL", 75, 31, { align: "center" });

  // Add subheader
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("TÚO LEY DE TRIBUTACIÓN MUNICIPAL D.S. N° 156-2004-EF y", 75, 35, {
    align: "center",
  });
  doc.text("Modificatorias", 75, 38, { align: "center" });

  // Address
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H.", 15, 48);
  doc.text("Las Capullanas - Veintiseis de Octubre .", 15, 52);

  // Add fiscal year box
  doc.rect(15, 56, 45, 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("EJERCICIO FISCAL", 37.5, 60, { align: "center" });
  doc.text(hojaResumenResult[0]?.anio ?? "", 37.5, 65, { align: "center" });

  // Add HR title
  doc.setFontSize(24);
  doc.text("HR", 80, 60, { align: "center" });

  doc.setFontSize(11);
  doc.text("HOJA RESUMEN", 80, 67, { align: "center" });

  // Add page number
  doc.setFontSize(7);
  doc.text("Pág 1 de 1", 145, 15, { align: "right" });

  // Add reference boxes
  doc.rect(100, 56, 45, 6);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("N° DE REFERENCIA:", 102, 59);
  doc.setFont("helvetica", "normal");
  doc.text(hrResult[0]?.numhr ?? "", 142, 59, { align: "right" });

  // Date box
  doc.rect(100, 62, 45, 6);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE EMISIÓN:", 102, 65);
  doc.setFont("helvetica", "normal");
  doc.text(hojaResumenResult[0]?.fecha?.toLocaleDateString() ?? "", 142, 65, {
    align: "right",
  });

  // Contributor data section
  doc.rect(15, 71, 130, 4);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CONTRIBUYENTE", 16, 74);

  // Contributor details table
  doc.rect(15, 75, 130, 8);
  doc.line(95, 75, 95, 83);
  doc.line(115, 75, 115, 83);

  // Table headers
  doc.setFontSize(6);
  doc.text("APELLIDOS Y NOMBRES / RAZON SOCIAL", 16, 78);
  doc.text("DNI / CIP / RUC", 97, 78);
  doc.text("CÓDIGO", 117, 78);

  // Contributor data
  doc.setFont("helvetica", "normal");
  doc.text(titularesResult[0]?.nombre_bd ?? "", 16, 81);
  doc.text(titularesResult[0]?.numero_bd ?? "", 97, 81);
  doc.text(titularesResult[0]?.id_persona_bd ?? "", 117, 81);

  // Fiscal address
  doc.rect(15, 83, 130, 8);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("DOMICILIO FISCAL", 16, 86);
  doc.setFont("helvetica", "normal");
  doc.text(domiciliosResult[0]?.domicilio ?? "", 16, 89, { maxWidth: 127 });

  // Declared properties section
  doc.setFont("helvetica", "bold");
  doc.text("RELACIÓN DE PREDIOS DECLARADOS", 16, 97);

  // Property table
  const tableHeight = 45;
  doc.rect(15, 99, 130, tableHeight);
  doc.line(45, 99, 45, 99 + tableHeight);
  doc.line(115, 99, 115, 99 + tableHeight);

  // Table headers
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("UNIDAD CATASTRAL", 16, 102);
  doc.text("UBICACIÓN DEL PREDIO", 80, 102, { align: "center" });
  doc.setFontSize(4.5);
  doc.text("ZONA/URBANA / ZONA RURAL", 80, 105, { align: "center" });
  doc.setFontSize(5);
  doc.text("VALOR DEL PREDIO", 132, 102, { align: "center" });
  doc.text("AFECTO S/.", 132, 105, { align: "center" });

  // Add property data
  doc.setFont("helvetica", "normal");
  prediosResult.forEach((predio, index) => {
    const yPos = 108 + index * 6;
    doc.setFontSize(4.5);
    const unidadLines = doc.splitTextToSize(predio.c0500id_uni_cat ?? "", 28);
    doc.text(unidadLines, 16, yPos);

    const ubicacionLines = doc.splitTextToSize(predio.ubicacion ?? "", 68);
    doc.text(ubicacionLines, 47, yPos);

    doc.text((predio.n0500porctit?.toString() ?? "") + "%", 114, yPos, {
      align: "right",
    });
    doc.setFontSize(5);
    doc.text(predio.valor_predio?.toFixed(2) ?? "", 132, yPos, {
      align: "center",
    });
  });

  // Base imponible
  doc.rect(15, 144, 130, 4);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("BASE IMPONIBLE (S/ )", 95, 147);
  doc.text(hojaResumenResult[0]?.baseimp?.toFixed(2) ?? "", 142, 147, {
    align: "right",
  });

  // Tax calculation section
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DETERMINACION Y LIQUIDACION DEL IMPUESTO (S/.)", 16, 153);

  // Tax calculation table
  doc.rect(15, 155, 130, 8);
  doc.line(30, 155, 30, 163);
  doc.line(75, 155, 75, 163);
  doc.line(90, 155, 90, 163);
  doc.line(120, 155, 120, 163);
  doc.line(30, 157.5, 75, 157.5);

  // Headers
  doc.setFontSize(5);
  doc.text("N° PREDIOS", 16, 157);
  doc.text("TRAMOS DEL VALUO", 52.5, 157, { align: "center" });
  doc.text("EN UIT", 32, 160);
  doc.text("EN S/", 55, 160);
  doc.text("ALICUOTA", 82.5, 157, { align: "center" });
  doc.text("BASE IMPONIBLE", 105, 157, { align: "center" });
  doc.text("POR TRAMOS", 105, 160, { align: "center" });
  doc.text("IMPUESTO", 125, 157, { align: "center" });

  // Values
  doc.setFont("helvetica", "normal");
  const yPos = 162;
  doc.text(hojaResumenResult[0]?.numpredios?.toString() ?? "", 22.5, yPos, {
    align: "center",
  });
  doc.text(footerResult[0]?.descbaseuit_bd?.trim() ?? "", 32, yPos);
  doc.text(footerResult[0]?.descbasesoles_bd?.trim() ?? "", 52.5, yPos);
  doc.text(
    ((Number(footerResult[0]?.tasa_bd ?? 0) * 100)?.toFixed(1) ?? "") + "%",
    82.5,
    yPos,
    {
      align: "center",
    }
  );
  doc.text(footerResult[0]?.base_bd?.toFixed(2) ?? "", 105, yPos, {
    align: "center",
  });
  doc.text(footerResult[0]?.impuesto_bd?.toFixed(2) ?? "", 125, yPos, {
    align: "center",
  });

  // Remember text
  doc.setFontSize(4.5);
  doc.text(
    "RECUERDE: Si cancela el IMPORTE ANUAL* hasta el último día hábil del mes de vencimiento, no",
    16,
    166
  );
  doc.text(
    "estará sujeto al reajuste por la variación acumulada del Indice de Prescios al por Mayor (IPM) que",
    16,
    168
  );
  doc.text(
    'publica el instituto Nacional de Estadística e Informática - INEI (Art 15 inciso "b" de la LTM)',
    16,
    170
  );

  // Totals section
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");

  doc.rect(90, 164, 55, 5);
  doc.rect(90, 169, 55, 5);
  doc.rect(90, 174, 55, 5);

  doc.text("IMPUESTO ANUAL CON REDONDEO", 92, 167);
  doc.text(hojaResumenResult[0]?.impuesto?.toFixed(2) ?? "", 142, 167, {
    align: "right",
  });
  doc.text("GASTOS DE EMISION(S/)", 92, 172);
  doc.text(hojaResumenResult[0]?.gastos?.toFixed(2) ?? "", 142, 172, {
    align: "right",
  });
  doc.text("TOTAL IMPORTE ANUAL (S/)", 92, 177);
  doc.text(hojaResumenResult[0]?.total?.toFixed(2) ?? "", 142, 177, {
    align: "right",
  });

  // Payment quotas section
  doc.text("MONTOS A PAGAR CON OPCION EN CUOTAS(S/)", 16, 190);

  // Quota table
  doc.rect(15, 192, 130, 10);
  doc.line(47.5, 192, 47.5, 202);
  doc.line(80, 192, 80, 202);
  doc.line(112.5, 192, 112.5, 202);

  // Quota headers and values
  const quotaNotes = [
    "(INCLUYE GASTOS DE EMISION)",
    "(NO INCLUYE REAJUSTE IPM)",
    "(NO INCLUDE REAJUSTE IPM)",
    "(NO INCLUYE REAJUSTE IPM)",
  ];

  // Since we don't have actual quota data, we'll use placeholder values
  const placeholderQuotas = [
    {
      numero: "1ra Cuota",
      vencimiento: "28/02/2024",
      importe: Number(hojaResumenResult[0]?.total ?? 0) / 4,
    },
    {
      numero: "2da Cuota",
      vencimiento: "31/05/2024",
      importe: Number(hojaResumenResult[0]?.total ?? 0) / 4,
    },
    {
      numero: "3ra Cuota",
      vencimiento: "31/08/2024",
      importe: Number(hojaResumenResult[0]?.total ?? 0) / 4,
    },
    {
      numero: "4ta Cuota",
      vencimiento: "30/11/2024",
      importe: Number(hojaResumenResult[0]?.total ?? 0) / 4,
    },
  ];

  placeholderQuotas.forEach((cuota, index) => {
    const x = 16 + index * 32.5;
    doc.setFont("helvetica", "bold");
    doc.text(cuota.numero, x + 16, 194, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(cuota.vencimiento, x + 16, 196, { align: "center" });
    doc.text(cuota.importe.toFixed(2), x + 16, 198, { align: "center" });
    doc.setFontSize(4);
    doc.text(quotaNotes[index], x + 16, 200, { align: "center" });
  });

  // Important note at bottom
  doc.setFontSize(4);
  const importantNote =
    "IMPORTANTE: El presente documento y sus anexos constituyen su Declaración Jurada Anual. Los datos contenidos en ellos se consideran ciertos en caso no los objete u observe hasta el último día hábil del mes de vencimiento del Ejercicio Fiscal al";
  const importantNote2 =
    'que corresponde la presente Declaración. (Art. 14 inciso "a" LTM - (*)) Normas Disp.Final TUO. C.T. D.S. N° 133-2013-EF';

  doc.text(importantNote, 16, 206);
  doc.text(importantNote2, 16, 208);

  // Document number at bottom right
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(hrResult[0]?.numhr ?? "", 145, 208, { align: "right" });

  // Save the PDF
  // try {
  //   const fileName = `HR-${titularesResult[0]?.id_persona_bd ?? ""}.pdf`;
  //   const pdfBuffer = doc.output("arraybuffer");
  //   return { success: true, fileName, pdfBuffer };
  // } catch (err) {
  //   console.error("Error generating PDF:", err);
  //   return { success: false };
  // }

  return doc;
};
