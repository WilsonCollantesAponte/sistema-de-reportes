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
  doc.addImage(logo, "JPEG", 10, 15, 20, 20);

  // Add municipality name
  doc.setFontSize(8);
  doc.text("MUNICIPALIDAD DISTRITAL", 10, 40);
  doc.text("VEINTISÉIS DE OCTUBRE", 10, 44);

  // Add header text
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARACIÓN JURADA DEL", 74, 20, { align: "center" });
  doc.text("IMPUESTO PREDIAL", 74, 25, { align: "center" });

  // Add subheader
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("TÚO LEY DE TRIBUTACIÓN MUNICIPAL D.S. N° 156-2004-EF y", 74, 30, {
    align: "center",
  });
  doc.text("Modificatorias", 74, 33, { align: "center" });

  // Address
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H.", 10, 48);
  doc.text("Las Capullanas - Veintiseis de Octubre .", 10, 52);

  // Add fiscal year box
  doc.rect(10, 56, 45, 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("EJERCICIO FISCAL", 37.5 - 2.5, 60, { align: "center" });
  doc.text(hojaResumenResult[0]?.anio ?? "", 37.5 - 2.5, 65, {
    align: "center",
  });

  // Add HR title
  doc.setFontSize(24);
  doc.text("HR", 80 - 5, 60, { align: "center" });

  doc.setFontSize(11);
  doc.text("HOJA RESUMEN", 80 - 5, 67, { align: "center" });

  // Add page number
  doc.setFontSize(7);
  doc.text("Pag 1 de 1", 122, 36);

  // Add reference boxes
  doc.rect(100 - 5, 56, 45, 6);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("N° DE REFERENCIA:", 102 - 5, 59);
  doc.setFont("helvetica", "normal");
  doc.text(hrResult[0]?.numhr ?? "", 142 - 5, 59, { align: "right" });

  // Date box
  doc.rect(100 - 5, 62, 45, 6);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE EMISIÓN:", 102 - 5, 65);
  doc.setFont("helvetica", "normal");
  doc.text(
    hojaResumenResult[0]?.fecha?.toLocaleDateString() ?? "",
    142 - 5,
    65,
    {
      align: "right",
    }
  );

  // Contributor data section
  doc.rect(10, 71, 130, 4);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CONTRIBUYENTE", 11, 74);

  // Contributor details table
  doc.rect(10, 75, 130, 8);
  doc.line(95 - 5, 75, 95 - 5, 83);
  doc.line(115 - 5, 75, 115 - 5, 83);

  // Table headers
  doc.setFontSize(6);
  doc.text("APELLIDOS Y NOMBRES / RAZON SOCIAL", 11, 78);
  doc.text("DNI / CIP / RUC", 97 - 5, 78);
  doc.text("CÓDIGO", 117 - 5, 78);

  // Contributor data
  doc.setFont("helvetica", "normal");
  doc.text(titularesResult[0]?.nombre_bd ?? "", 11, 81);
  doc.text(titularesResult[0]?.numero_bd ?? "", 97 - 5, 81);
  doc.text(titularesResult[0]?.id_persona_bd ?? "", 117 - 5, 81);

  // Fiscal address
  doc.rect(10, 83, 130, 8);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("DOMICILIO FISCAL", 11, 86);
  doc.setFont("helvetica", "normal");
  doc.text(domiciliosResult[0]?.domicilio ?? "", 11, 89, { maxWidth: 127 });

  // Declared properties section
  doc.setFont("helvetica", "bold");
  doc.text("RELACIÓN DE PREDIOS DECLARADOS", 11, 97);

  // Property table
  const tableHeight = 45;
  doc.rect(10, 99, 130, tableHeight);
  doc.line(40, 99, 40, 99 + tableHeight);
  doc.line(110, 99, 110, 99 + tableHeight);

  // Table headers
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("UNIDAD CATASTRAL", 11, 102);
  doc.text("UBICACIÓN DEL PREDIO", 80 - 5, 102, { align: "center" });
  doc.setFontSize(4.5);
  doc.text("ZONA/URBANA / ZONA RURAL", 80 - 5, 105, { align: "center" });
  doc.setFontSize(5);
  doc.text("VALOR DEL PREDIO", 132 - 5, 102, { align: "center" });
  doc.text("AFECTO S/.", 132 - 5, 105, { align: "center" });

  // Add property data
  doc.setFont("helvetica", "normal");
  prediosResult.forEach((predio, index) => {
    const yPos = 108 + index * 6;
    doc.setFontSize(4.5);
    const unidadLines = doc.splitTextToSize(predio.c0500id_uni_cat ?? "", 28);
    doc.text(unidadLines, 11, yPos);

    const ubicacionLines = doc.splitTextToSize(predio.ubicacion ?? "", 68);
    doc.text(ubicacionLines, 47 - 5, yPos);

    doc.text((predio.n0500porctit?.toString() ?? "") + "%", 114 - 5, yPos, {
      align: "right",
    });
    doc.setFontSize(5);
    doc.text(predio.valor_predio?.toFixed(2) ?? "", 132 - 5, yPos, {
      align: "center",
    });
  });

  // Base imponible
  doc.rect(10, 144, 130, 4);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("BASE IMPONIBLE (S/ )", 95 - 5, 147);
  doc.text(hojaResumenResult[0]?.baseimp?.toFixed(2) ?? "", 142 - 5, 147, {
    align: "right",
  });

  // Tax calculation section
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DETERMINACION Y LIQUIDACION DEL IMPUESTO (S/.)", 11, 153);

  // Tax calculation table
  doc.rect(10, 155, 130, 8);
  doc.line(30 - 5, 155, 30 - 5, 163);
  doc.line(75 - 5, 155, 75 - 5, 163);
  doc.line(90 - 5, 155, 90 - 5, 163);
  doc.line(120 - 5, 155, 120 - 5, 163);
  doc.line(30 - 5, 157.5, 75 - 5, 157.5);

  // Headers
  doc.setFontSize(5);
  doc.text("N° PREDIOS", 11, 157);
  doc.text("TRAMOS DEL VALUO", 52.5 - 5, 157, { align: "center" });
  doc.text("EN UIT", 32 - 5, 160);
  doc.text("EN S/", 55 - 5, 160);
  doc.text("ALICUOTA", 82.5 - 5, 157, { align: "center" });
  doc.text("BASE IMPONIBLE", 105 - 5, 157, { align: "center" });
  doc.text("POR TRAMOS", 105 - 5, 160, { align: "center" });
  doc.text("IMPUESTO", 125 - 5, 157, { align: "center" });

  // Values
  doc.setFont("helvetica", "normal");
  const yPos = 162;
  doc.text(hojaResumenResult[0]?.numpredios?.toString() ?? "", 22.5 - 5, yPos, {
    align: "center",
  });
  doc.text(footerResult[0]?.descbaseuit_bd?.trim() ?? "", 32 - 5, yPos);
  doc.text(footerResult[0]?.descbasesoles_bd?.trim() ?? "", 52.5 - 5, yPos);
  doc.text(
    ((Number(footerResult[0]?.tasa_bd ?? 0) * 100)?.toFixed(1) ?? "") + "%",
    82.5 - 5,
    yPos,
    {
      align: "center",
    }
  );
  doc.text(footerResult[0]?.base_bd?.toFixed(2) ?? "", 105 - 5, yPos, {
    align: "center",
  });
  doc.text(footerResult[0]?.impuesto_bd?.toFixed(2) ?? "", 125 - 5, yPos, {
    align: "center",
  });

  // Remember text
  doc.setFontSize(4.5);
  doc.text(
    "RECUERDE: Si cancela el IMPORTE ANUAL* hasta el último día hábil del mes de vencimiento, no",
    11,
    166
  );
  doc.text(
    "estará sujeto al reajuste por la variación acumulada del Indice de Prescios al por Mayor (IPM) que",
    11,
    168
  );
  doc.text(
    'publica el instituto Nacional de Estadística e Informática - INEI (Art 15 inciso "b" de la LTM)',
    11,
    170
  );

  // Totals section
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");

  doc.rect(90 - 5, 164, 55, 5);
  doc.rect(90 - 5, 169, 55, 5);
  doc.rect(90 - 5, 174, 55, 5);

  doc.text("IMPUESTO ANUAL CON REDONDEO", 92 - 5, 167);
  doc.text(hojaResumenResult[0]?.impuesto?.toFixed(2) ?? "", 142 - 5, 167, {
    align: "right",
  });
  doc.text("GASTOS DE EMISION(S/)", 92 - 5, 172);
  doc.text(hojaResumenResult[0]?.gastos?.toFixed(2) ?? "", 142 - 5, 172, {
    align: "right",
  });
  doc.text("TOTAL IMPORTE ANUAL (S/)", 92 - 5, 177);
  doc.text(hojaResumenResult[0]?.total?.toFixed(2) ?? "", 142 - 5, 177, {
    align: "right",
  });

  // Payment quotas section
  doc.text("MONTOS A PAGAR CON OPCION EN CUOTAS(S/)", 11, 183); // Changed from 190 to 183

  // Quota table
  doc.rect(10, 185, 130, 10); // Changed from 192 to 185
  doc.line(47.5 - 5, 185, 47.5 - 5, 195); // Changed from 192 to 185, and 202 to 195
  doc.line(80 - 5, 185, 80 - 5, 195); // Changed from 192 to 185, and 202 to 195
  doc.line(112.5 - 5, 185, 112.5 - 5, 195); // Changed from 192 to 185, and 202 to 195

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
    const x = 16 + index * 32.5 - 5;
    doc.setFont("helvetica", "bold");
    doc.text(cuota.numero, x + 16, 187, { align: "center" }); // Changed from 194 to 187
    doc.setFont("helvetica", "normal");
    doc.text(cuota.vencimiento, x + 16, 189, { align: "center" }); // Changed from 196 to 189
    doc.text(cuota.importe.toFixed(2), x + 16, 191, { align: "center" }); // Changed from 198 to 191
    doc.setFontSize(4);
    doc.text(quotaNotes[index], x + 16, 193, { align: "center" }); // Changed from 200 to 193
  });

  // Important note at bottom
  doc.setFontSize(4);
  const importantNote =
    "IMPORTANTE: El presente documento y sus anexos constituyen su Declaración Jurada Anual. Los datos contenidos\nen ellos se consideran ciertos en caso no los objete u observe hasta el último día hábil del mes de vencimiento del Ejercicio Fiscal al";
  const importantNote2 =
    'que corresponde la presente Declaración. (Art. 14 inciso "a" LTM - (*)) Normas Disp.Final TUO. C.T. D.S. N° 133-2013-EF';

  doc.text(importantNote, 11, 199);
  doc.text(importantNote2, 11, 202.5);

  // Document number at bottom right
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(hrResult[0]?.numhr ?? "", 145 - 5, 206, { align: "right" });

  return doc;
};
