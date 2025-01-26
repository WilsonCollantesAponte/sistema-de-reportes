import jsPDF from "jspdf";

interface Predio {
  unidadCatastral: string;
  ubicacion: string;
  valorPredio: number;
}

interface Contribuyente {
  apellidosNombres: string;
  dniRuc: string;
  codigo: string;
  domicilioFiscal: string;
  predios: Predio[];
}

export const generateHRPdf = async (contribuyente: Contribuyente) => {
  // Create new PDF document with A5 size
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Add municipal logo with adjusted size (20x20mm)
  const logoUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbfLf7NwgfyVkd14s-e1L1k5eW04-2cAKwl-wCEl3gFDW1IVLobqve57qyw3nTkE_lcFI&usqp=CAU";
  const logo = await loadImage(logoUrl);
  doc.addImage(logo, "PNG", 15, 15, 20, 20);

  // Add municipality name with better spacing
  doc.setFontSize(8);
  doc.text("MUNICIPALIDAD DISTRITAL", 15, 40);
  doc.text("VEINTISÉIS DE OCTUBRE", 15, 44);

  // Add header text with improved spacing
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARACIÓN JURADA DEL", 75, 25, { align: "center" });
  doc.text("IMPUESTO PREDIAL", 75, 31, { align: "center" });

  // Add subheader with adjusted spacing
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("TÚO LEY DE TRIBUTACIÓN MUNICIPAL D.S. N° 156-2004-EF y", 75, 35, {
    align: "center",
  });
  doc.text("Modificatorias", 75, 38, { align: "center" });

  // Address with adjusted spacing
  doc.text("Av. Prolongacion Grau - Mz. N Lote 1 A.H.", 15, 48);
  doc.text("Las Capullanas - Veintiseis de Octubre .", 15, 52);

  // Add fiscal year box
  doc.rect(15, 56, 45, 12);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("EJERCICIO FISCAL", 37.5, 60, { align: "center" });
  doc.text("2024", 37.5, 65, { align: "center" });

  // Add HR title with adjusted positioning
  doc.setFontSize(24);
  doc.text("HR", 80, 60, { align: "center" });

  doc.setFontSize(11);
  doc.text("HOJA RESUMEN", 80, 67, { align: "center" });

  // Add page number
  doc.setFontSize(7);
  doc.text("Pág 1 de 1", 145, 15, { align: "right" });

  // Add reference boxes with adjusted alignment
  doc.rect(100, 56, 45, 6);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("N° DE REFERENCIA:", 102, 59);
  doc.setFont("helvetica", "normal");
  doc.text("2024043198", 142, 59, { align: "right" });

  // Date box
  doc.rect(100, 62, 45, 6);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA DE EMISIÓN:", 102, 65);
  doc.setFont("helvetica", "normal");
  doc.text("25/01/2025", 142, 65, { align: "right" });

  // Contributor data section with adjusted spacing
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
  doc.text(contribuyente.apellidosNombres, 16, 81);
  doc.text(contribuyente.dniRuc, 97, 81);
  doc.text(contribuyente.codigo, 117, 81);

  // Fiscal address
  doc.rect(15, 83, 130, 8);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("DOMICILIO FISCAL", 16, 86);
  doc.setFont("helvetica", "normal");
  doc.text(contribuyente.domicilioFiscal, 16, 89, { maxWidth: 127 });

  // Declared properties section
  doc.setFont("helvetica", "bold");
  doc.text("RELACIÓN DE PREDIOS DECLARADOS", 16, 97);

  // Property table with adjusted height
  const tableHeight = 45; // Slightly reduced height
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
  contribuyente.predios.forEach((predio, index) => {
    const yPos = 108 + index * 6;
    doc.setFontSize(4.5);
    const unidadLines = doc.splitTextToSize(predio.unidadCatastral, 28);
    doc.text(unidadLines, 16, yPos);

    const ubicacionLines = doc.splitTextToSize(predio.ubicacion, 68);
    doc.text(ubicacionLines, 47, yPos);

    doc.text("(50.000%)", 114, yPos, { align: "right" });
    doc.setFontSize(5);
    doc.text(predio.valorPredio.toFixed(2), 132, yPos, { align: "center" });
  });

  // Base imponible with adjusted spacing
  doc.rect(15, 144, 130, 4);
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("BASE IMPONIBLE (S/ )", 95, 147);
  doc.text("8,100.00", 142, 147, { align: "right" });

  // Tax calculation section with more compact spacing
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DETERMINACION Y LIQUIDACION DEL IMPUESTO (S/.)", 16, 153);

  // Tax calculation table with minimal height
  doc.rect(15, 155, 130, 8); // Reduced height from 10 to 8

  // Vertical lines with reduced height
  doc.line(30, 155, 30, 163); // After N° PREDIOS
  doc.line(75, 155, 75, 163); // After TRAMOS DEL VALUO
  doc.line(90, 155, 90, 163); // After ALICUOTA
  doc.line(120, 155, 120, 163); // After BASE IMPONIBLE

  // Horizontal line for TRAMOS DEL VALUO subdivision
  doc.line(30, 157.5, 75, 157.5); // Adjusted position

  // Headers with tighter positioning
  doc.setFontSize(5);
  doc.text("N° PREDIOS", 16, 157);
  doc.text("TRAMOS DEL VALUO", 52.5, 157, { align: "center" });
  doc.text("EN UIT", 32, 160);
  doc.text("EN S/", 55, 160);
  doc.text("ALICUOTA", 82.5, 157, { align: "center" });
  doc.text("BASE IMPONIBLE", 105, 157, { align: "center" });
  doc.text("POR TRAMOS", 105, 160, { align: "center" });
  doc.text("IMPUESTO", 125, 157, { align: "center" });

  // Values with compact alignment
  doc.setFont("helvetica", "normal");
  doc.text("1", 22.5, 162, { align: "center" });
  doc.text("HASTA 15 UIT", 32, 162);
  doc.text("HASTA 77250.00", 52.5, 162);
  doc.text("0.20%", 82.5, 162, { align: "center" });
  doc.text("8100.00", 105, 162, { align: "center" });
  doc.text("16.20", 125, 162, { align: "center" });

  // Remember text with minimal spacing
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

  // Totals section with minimal spacing and thin borders
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");

  // Draw boxes for totals with reduced height
  doc.rect(90, 164, 55, 5); // IMPUESTO ANUAL
  doc.rect(90, 169, 55, 5); // GASTOS DE EMISION
  doc.rect(90, 174, 55, 5); // TOTAL IMPORTE ANUAL

  doc.text("IMPUESTO ANUAL CON REDONDEO", 92, 167);
  doc.text("30.90", 142, 167, { align: "right" });
  doc.text("GASTOS DE EMISION(S/)", 92, 172);
  doc.text("7.90", 142, 172, { align: "right" });
  doc.text("TOTAL IMPORTE ANUAL (S/)", 92, 177);
  doc.text("38.80", 142, 177, { align: "right" });

  // Payment quotas section with minimal spacing
  doc.text("MONTOS A PAGAR CON OPCION EN CUOTAS(S/)", 16, 190);

  // Quota table with reduced height
  doc.rect(15, 192, 130, 10); // Reduced height
  doc.line(47.5, 192, 47.5, 202); // After 1° CUOTA
  doc.line(80, 192, 80, 202); // After 2° CUOTA
  doc.line(112.5, 192, 112.5, 202); // After 3° CUOTA

  // Quota headers and values with compact positioning
  const quotaHeaders = [
    ["1° CUOTA", "(VENCE EN FEBRERO)", "15.63"],
    ["2° CUOTA", "(VENCE EN MAYO)", "7.73"],
    ["3° CUOTA", "(VENCE EN AGOSTO)", "7.73"],
    ["4° CUOTA", "(VENCE EN NOVIEMBRE)", "7.73"],
  ];

  const quotaNotes = [
    "(INCLUYE GASTOS DE EMISION)",
    "(NO INCLUYE REAJUSTE IPM)",
    "(NO INCLUYE REAJUSTE IPM)",
    "(NO INCLUYE REAJUSTE IPM)",
  ];

  quotaHeaders.forEach((quota, index) => {
    const x = 16 + index * 32.5;
    doc.setFont("helvetica", "bold");
    doc.text(quota[0], x + 16, 194, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(quota[1], x + 16, 196, { align: "center" });
    doc.text(quota[2], x + 16, 198, { align: "center" });
    doc.setFontSize(4);
    doc.text(quotaNotes[index], x + 16, 200, { align: "center" });
  });

  // Important note at bottom with minimal spacing
  doc.setFontSize(4);
  const importantNote =
    "IMPORTANTE: El presente documento y sus anexos constituyen su Declaración Jurada Anual. Los datos contenidos en ellos se consideran ciertos en caso no los objete u observe hasta el último día hábil del mes de vencimiento del Ejercicio Fiscal al";
  const importantNote2 =
    'que corresponde la presente Declaración. (Art. 14 inciso "a" LTM - (*)) Normas Disp.Final TUO. C.T. D.S. N° 133-2013-EF';

  doc.text(importantNote, 16, 206);
  doc.text(importantNote2, 16, 208);

  // Document number at bottom right with adjusted position
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("043198", 145, 208, { align: "right" });

  // Save the PDF
  try {
    // Save the PDF with a specific name
    const fileName = `HR-${contribuyente.codigo}.pdf`;
    doc.save(fileName);

    // Get the actual downloads path from the browser
    const downloadPath = `Descargas/${fileName}`;

    return { success: true, fileName, downloadPath };
  } catch (err) {
    console.error("Error saving file:", err);
    return { success: false };
  }
};

// Helper function to load image
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};
