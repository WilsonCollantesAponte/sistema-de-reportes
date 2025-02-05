import { jsPDF } from "jspdf";

interface DamMasivoReporte {
  numdam: string;
  codcont: string;
}

interface DeterminacionArbitriosMunicipal {
  c0506codcont_bd: string;
  c0506anio_bd: string;
  c0506numdam_bd: string;
  c0506id_uni_cat_bd: string;
  c0506id_ficha_bd: string;
  c0506numhra_bd: string;
  c0506codvia_bd: string;
  c0506idlugar_bd: string;
  c0506numemuni_bd: string;
  c0506manzana_bd: string;
  c0506lote_bd: string;
  c0506piso_bd: string;
  c0506dpto_bd: string;
  c0506mesi_bd: string;
  c0506mesf_bd: string;
  n0506porctit_bd: number;
  c0506coduso_bd: string;
  n0506iduso_bd: number;
  n0506factfrecrecolec_bd: number | null;
  n0506idcercania_bd: number;
  n0506factusorecolec_bd: number;
  n0506factfrecbarrido_bd: number;
  n0506factusobarrido_bd: number;
  n0506factorposgeogparques_bd: number | null;
  n0506factoraforo_bd: number;
  n0506factorpelig_bd: number | null;
  n0506factorusoseren_bd: number;
  n0506areaconstruida_bd: number;
  n0506frontis_bd: number;
  n0506recojo_bd: number;
  n0506barrido_bd: number;
  n0506limpieza_bd: number | null;
  n0506areasverdes_bd: number;
  n0506serenazgo_bd: number;
  n0506limpiezaredond_bd: number;
  n0506areasverdesredond_bd: number;
  n0506serenazgoredond_bd: number;
  n0506gastoformato_bd: number;
  n0506arbitriototal_bd: number;
  n0506arbitrioredondtotal_bd: number;
  c0500usuario_bd: string;
  d0500fecha_bd: Date;
  usariomod_bd: string;
  cobservacion_bd: string;
  tipotabla_bd: string;
  numpaquete: string;
  msjpie_bd: string;
}

interface DeterminacionArbitrioTitularReporte {
  id_persona_bd: string;
  nombre_bd: string;
  abrev_bd: string | null;
  numero_bd: string | null;
}

interface DeterminacionArbitrioDomicilioFiscalTitularDam {
  c0505codcont: string;
  ubicacion: string;
}

interface DeterminacionArbitrioUbicacionPredioDam {
  c0500numpu: string;
  c0500codcont: string;
  ubicacion: string;
}

interface DeterminacionArbitrioUsosPrediosDam {
  desc_uso_catastro: string;
  desc_uso_arbitrio: string;
  area_uso_arbitrio: number;
}

export function generateDAM(
  dam_masivo_reporte: DamMasivoReporte[],
  determinacionarbitriosmunicipal: DeterminacionArbitriosMunicipal[],
  determinacionarbitriotitularreporte: DeterminacionArbitrioTitularReporte[],
  determinacionarbitriodomiciliofiscaltitulardam: DeterminacionArbitrioDomicilioFiscalTitularDam[],
  determinacionarbitrioubicacionprediodam: DeterminacionArbitrioUbicacionPredioDam[],
  determinacionarbitriousosprediosdam: DeterminacionArbitrioUsosPrediosDam[],
  logo: Uint8Array
) {
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  doc.addImage(logo, "JPEG", 120, 15, 20, 20);

  // Ajustar tamaños de fuente para formato A5 más comprimido
  const titleSize = 9;
  const normalSize = 6;
  const smallSize = 5;
  const tinySize = 4;

  // Ajustar márgenes horizontales
  const marginLeft = 5;
  // const marginRight = 5;
  const contentWidth = 138; // A5 width (148mm) - margins

  // Logo (posición ajustada)
  // const logo = new Image();
  // logo.src = "/logo-municipalidad.png";
  // doc.addImage(logo, "PNG", marginLeft, 5, 15, 15); // Tamaño reducido

  // Título principal - más compacto
  doc.setFontSize(titleSize);
  doc.text("DETERMINACIÓN DE ARBITRIOS", 74, 8, { align: "center" });
  doc.text("MUNICIPALES", 74, 13, { align: "center" });

  // Subtítulo - más compacto
  doc.setFontSize(tinySize);
  doc.text("CONFORME A LOS LINEAMIENTOS ESTABLECIDOS POR EL", 74, 17, {
    align: "center",
  });
  doc.text("TRIBUNAL CONSTITUCIONAL, TRIBUNAL FISCAL Y DEFENSORIA", 74, 20, {
    align: "center",
  });
  doc.text("DEL PUEBLO", 74, 23, { align: "center" });

  // Información municipalidad - ajustada a la izquierda
  doc.setFontSize(smallSize);
  doc.text("MUNICIPALIDAD DISTRITAL", marginLeft, 25);
  doc.text("VEINTISEIS DE OCTUBRE", marginLeft, 28);
  doc.text("Av. Prolongacion Grau - Mz. N Lote", marginLeft, 31);
  doc.text("1 A.H. Las Capullanas - Veintiseis", marginLeft, 34);

  // DAM y paginación
  doc.setFontSize(titleSize);
  doc.text("DAM", 74, 32, { align: "center" });
  doc.setFontSize(smallSize);

  // Cajas de información - comprimidas horizontalmente
  const boxWidth = contentWidth / 3 - 2;

  // Ejercicio Fiscal
  doc.rect(marginLeft, 37, boxWidth, 12);
  doc.setFontSize(normalSize);
  doc.text("EJERCICIO FISCAL", marginLeft + 2, 41);
  doc.text(
    determinacionarbitriosmunicipal[0]?.c0506anio_bd ?? "",
    marginLeft + 15,
    46
  );

  // Unidad Catastral
  const ucX = marginLeft + boxWidth + 2;
  doc.rect(ucX, 37, boxWidth, 12);
  doc.text("UNIDAD CATASTRAL", ucX + 2, 41);
  doc.text(
    determinacionarbitriosmunicipal[0]?.c0506id_uni_cat_bd ?? "",
    ucX + 2,
    46
  );

  // Número de determinación
  const ndX = ucX + boxWidth + 2;
  doc.rect(ndX, 37, boxWidth, 12);
  doc.text("N° DETERMINACIÓN:", ndX + 2, 41);
  doc.text(
    determinacionarbitriosmunicipal[0]?.c0506numdam_bd ?? "",
    ndX + 25,
    41
  );
  doc.text("FECHA DE EMISIÓN:", ndX + 2, 48);
  doc.text(
    determinacionarbitriosmunicipal[0]?.d0500fecha_bd?.toLocaleDateString() ??
      "",
    ndX + 25,
    48
  );

  // Datos del contribuyente - comprimido horizontalmente
  doc.rect(marginLeft, 51, contentWidth, 22);
  doc.setFontSize(normalSize);
  doc.text("DATOS DEL CONTRIBUYENTE", marginLeft + 2, 55);

  // Información del contribuyente
  doc.setFontSize(smallSize);
  doc.text("APELLIDOS Y NOMBRES / RAZÓN SOCIAL", marginLeft + 2, 59);
  doc.text(
    determinacionarbitriotitularreporte[0]?.nombre_bd ?? "",
    marginLeft + 2,
    63
  );

  // DNI y Código - ajustados a la derecha
  const dniX = ndX - 30;
  doc.text("DNI / CIP / RUC", dniX, 59);
  doc.text(
    determinacionarbitriotitularreporte[0]?.id_persona_bd ?? "",
    dniX,
    63
  );

  const codX = ndX;
  doc.text("CÓDIGO", codX, 59);
  doc.text(dam_masivo_reporte[0]?.codcont ?? "", codX, 63);

  // Domicilio fiscal
  doc.text("DOMICILIO FISCAL", marginLeft + 2, 67);
  doc.text(
    determinacionarbitriodomiciliofiscaltitulardam[0]?.ubicacion ?? "",
    marginLeft + 2,
    71
  );

  // Datos relativos al predio
  const predioY = 75;
  const tableWidth = 138;

  // Contenedor principal
  doc.rect(marginLeft, predioY, tableWidth, 55);
  doc.setFontSize(normalSize);
  doc.text(
    "DATOS RELATIVOS AL PREDIO PARA LA DETERMINACIÓN DE LOS ARBITRIOS MUNICIPALES",
    marginLeft + 2,
    predioY + 4
  );

  // Primera sección: Ubicación y Área
  const ubicacionWidth = tableWidth * 0.85;
  const areaWidth = tableWidth * 0.15;

  doc.rect(marginLeft, predioY + 7, ubicacionWidth, 13);
  doc.rect(marginLeft + ubicacionWidth, predioY + 7, areaWidth, 13);

  doc.setFontSize(smallSize);
  doc.text("UBICACIÓN DEL PREDIO", marginLeft + 2, predioY + 11);
  doc.text(
    determinacionarbitrioubicacionprediodam[0]?.ubicacion ?? "",
    marginLeft + 2,
    predioY + 16
  );

  doc.text("ÁREA CONSTRUIDA", marginLeft + ubicacionWidth + 2, predioY + 11);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506areaconstruida_bd?.toString() ??
      "0",
    marginLeft + ubicacionWidth + 2,
    predioY + 16
  );

  // Segunda sección: Uso, Categoría y Área Uso
  const usoWidth = tableWidth * 0.4;
  const categoriaWidth = tableWidth * 0.4;
  const areaUsoWidth = tableWidth * 0.2;

  doc.rect(marginLeft, predioY + 20, usoWidth, 13);
  doc.rect(marginLeft + usoWidth, predioY + 20, categoriaWidth, 13);
  doc.rect(
    marginLeft + usoWidth + categoriaWidth,
    predioY + 20,
    areaUsoWidth,
    13
  );

  doc.text("USO PRINCIPAL DEL PREDIO", marginLeft + 2, predioY + 24);
  doc.text(
    determinacionarbitriousosprediosdam[0]?.desc_uso_catastro ?? "",
    marginLeft + 2,
    predioY + 29
  );

  doc.text(
    "CATEGORIA DE USO PARA ARBITRIOS",
    marginLeft + usoWidth + 2,
    predioY + 24
  );
  doc.text(
    determinacionarbitriousosprediosdam[0]?.desc_uso_arbitrio ?? "",
    marginLeft + usoWidth + 2,
    predioY + 29
  );

  doc.text(
    "AREA USO",
    marginLeft + usoWidth + categoriaWidth + 2,
    predioY + 24
  );
  doc.text(
    determinacionarbitriousosprediosdam[0]?.area_uso_arbitrio?.toString() ??
      "0",
    marginLeft + usoWidth + categoriaWidth + 2,
    predioY + 29
  );

  // Tercera sección: Tablas de datos
  const dataY = predioY + 33;
  const limpiezaWidth = 15;
  const recoleccionWidth = tableWidth * 0.4;
  const barridoWidth = tableWidth * 0.4;
  const arbitrioWidth = tableWidth * 0.15;

  // Columna Limpieza Pública
  doc.rect(marginLeft, dataY, limpiezaWidth, 22);
  doc.setFontSize(tinySize);
  doc.text("LIMPIEZA", marginLeft + 2, dataY + 5);
  doc.text("PÚBLICA", marginLeft + 2, dataY + 9);

  // Tabla Recolección con subdivisiones exactas
  const recoleccionX = marginLeft + limpiezaWidth;
  doc.rect(recoleccionX, dataY, recoleccionWidth, 11);
  doc.text(
    "DATOS SOBRE RECOLECCIÓN DE RESIDUOS SOLIDOS",
    recoleccionX + 2,
    dataY + 3
  );

  // Subtabla recolección - 4 columnas exactas
  const subRecoleccionY = dataY + 4;
  const colWidth = recoleccionWidth / 4;

  // Columnas de recolección
  for (let i = 0; i < 4; i++) {
    doc.rect(recoleccionX + colWidth * i, subRecoleccionY, colWidth, 7);
  }

  // Textos de recolección
  doc.text("TASA RECOLECC.", recoleccionX, subRecoleccionY + 3);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506factusorecolec_bd?.toString() ??
      "0",
    recoleccionX + 2,
    subRecoleccionY + 6
  );

  doc.text("AREA CONST. (m2)", recoleccionX + colWidth, subRecoleccionY + 3);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506areaconstruida_bd?.toString() ??
      "0",
    recoleccionX + colWidth + 2,
    subRecoleccionY + 6
  );

  doc.text(
    "CALC. ANUAL S/",
    recoleccionX + colWidth * 2 + 1,
    subRecoleccionY + 3
  );
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506recojo_bd?.toString() ?? "0",
    recoleccionX + colWidth * 2 + 2,
    subRecoleccionY + 6
  );

  doc.text(
    "ARBITRIO CALC. S/",
    recoleccionX + colWidth * 3 + 0.5,
    subRecoleccionY + 3
  );
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506recojo_bd?.toString() ?? "0",
    recoleccionX + colWidth * 3 + 2,
    subRecoleccionY + 6
  );

  // Tabla Barrido con subdivisiones exactas
  const barridoX = recoleccionX + recoleccionWidth;
  doc.rect(barridoX, dataY, barridoWidth, 11);
  doc.text(
    "DATOS SOBRE BARRIDO DE CALLES Y LIMPIEZA DE VÍAS",
    barridoX + 2,
    dataY + 3
  );

  // Subtabla barrido - 4 columnas exactas
  for (let i = 0; i < 4; i++) {
    doc.rect(barridoX + colWidth * i, subRecoleccionY, colWidth, 7);
  }

  // Textos de barrido
  doc.text("TASA BARRIDO", barridoX + 2, subRecoleccionY + 3);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506factusobarrido_bd?.toString() ??
      "0",
    barridoX + 3,
    subRecoleccionY + 6
  );

  doc.text("FRONTIS (m)", barridoX + colWidth + 2, subRecoleccionY + 3);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506frontis_bd?.toString() ?? "0",
    barridoX + colWidth + 2,
    subRecoleccionY + 6
  );

  doc.text("CALC. ANUAL S/", barridoX + colWidth * 2 + 1, subRecoleccionY + 3);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506barrido_bd?.toString() ?? "0",
    barridoX + colWidth * 2 + 2,
    subRecoleccionY + 6
  );

  doc.text(
    "ARBITRIO CALC. S/",
    barridoX + colWidth * 3 + 0.5,
    subRecoleccionY + 3
  );
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506barrido_bd?.toString() ?? "0",
    barridoX + colWidth * 3 + 2,
    subRecoleccionY + 6
  );

  // Columna Arbitrio final
  const arbitrioX = barridoX + barridoWidth;
  doc.rect(arbitrioX, dataY, arbitrioWidth * 0.6, 22);
  doc.text("ARBITRIO", arbitrioX + 2, dataY + 3);
  doc.text("ANUAL S/", arbitrioX + 2, dataY + 5);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506limpieza_bd?.toString() ?? "0",
    arbitrioX + 2,
    dataY + 8
  );

  // Última fila: Parques y áreas verdes con divisiones exactas
  const parqueY = dataY + 11;

  // Columna izquierda Parques
  doc.rect(marginLeft, parqueY, limpiezaWidth, 11);
  doc.text("PARQUE Y", marginLeft + 2, parqueY + 3);
  doc.text("ÁREAS", marginLeft + 2, parqueY + 6);
  doc.text("VERDES", marginLeft + 2, parqueY + 9);

  // Sección ubicación
  doc.rect(recoleccionX, parqueY, recoleccionWidth, 11);
  doc.text("UBICACION", recoleccionX + 2, parqueY + 4);
  doc.text("OTRAS UBICACIONES", recoleccionX + 2, parqueY + 8);

  // Secciones finales con divisiones exactas
  const finalSectionWidth = barridoWidth / 6;

  // Tasa parques
  doc.rect(barridoX, parqueY, finalSectionWidth * 2, 11);
  doc.text("TASA PARQUES", barridoX + 2, parqueY + 4);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506factorposgeogparques_bd?.toString() ??
      "0",
    barridoX + 2,
    parqueY + 8
  );

  // Arbitrio anual
  doc.rect(barridoX + finalSectionWidth * 2, parqueY, finalSectionWidth, 11);
  doc.text("ARBITRIO", barridoX + finalSectionWidth * 2 + 2, parqueY + 4);
  doc.text("ANUAL S/", barridoX + finalSectionWidth * 2 + 2, parqueY + 6);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506areasverdes_bd?.toString() ?? "0",
    barridoX + finalSectionWidth * 2 + 2,
    parqueY + 8
  );

  // Serenazgo (texto vertical)
  doc.rect(barridoX + finalSectionWidth * 3, parqueY, finalSectionWidth, 11);
  // Rotación para texto vertical
  doc.text("SERENAZGO", barridoX + finalSectionWidth * 3 + 5, parqueY + 10, {
    angle: 90,
  });

  // Sector
  doc.rect(barridoX + finalSectionWidth * 4, parqueY, finalSectionWidth, 11);
  doc.text("SECTOR", barridoX + finalSectionWidth * 4 + 2, parqueY + 6);

  // Tasa
  doc.rect(barridoX + finalSectionWidth * 5, parqueY, finalSectionWidth, 11);
  doc.text("TASA", barridoX + finalSectionWidth * 5 + 2, parqueY + 4);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506factorusoseren_bd?.toString() ??
      "0",
    barridoX + finalSectionWidth * 5 + 2,
    parqueY + 8
  );

  // Arbitrio final
  doc.rect(arbitrioX, parqueY, arbitrioWidth * 0.6, 11);
  doc.text("ARBITRIO", arbitrioX + 2, parqueY + 4);
  doc.text("ANUAL S/", arbitrioX + 2, parqueY + 6);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506serenazgo_bd?.toString() ?? "0",
    arbitrioX + 2,
    parqueY + 9
  );

  // Liquidación anual
  const finalY = dataY + 28;
  doc.setFontSize(normalSize);
  doc.text(
    "LIQUIDACIÓN ANUAL A PAGAR POR ARBITRIOS MUNICIPALES S/",
    marginLeft + 2,
    finalY + 5
  );

  // Contenedor principal con tres cajas alineadas
  const boxHeightLiq = 15;
  const boxWidthLiq = 35;
  const boxSpacing = 5;
  const startBoxX = marginLeft + 10;
  const boxY = finalY + 8;

  // Primera caja - Total arbitrios municipales
  doc.rect(startBoxX, boxY, boxWidthLiq, boxHeightLiq);
  doc.setFontSize(8);
  doc.text("TOTAL ARBITRIOS", startBoxX + 2, boxY + 4);
  doc.text("MUNICIPALES", startBoxX + 2, boxY + 8);
  doc.setFontSize(9);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506arbitriototal_bd?.toString() ??
      "0",
    startBoxX + boxWidthLiq / 2,
    boxY + 12,
    { align: "center" }
  );

  // Símbolo +
  doc.setFontSize(12);
  doc.text(
    "+",
    startBoxX + boxWidthLiq + boxSpacing / 2 - 1,
    boxY + boxHeightLiq / 2
  );

  // Segunda caja - Gastos de emisión
  const middleBoxX = startBoxX + boxWidthLiq + boxSpacing;
  doc.rect(middleBoxX, boxY, boxWidthLiq, boxHeightLiq);
  doc.setFontSize(8);
  doc.text("GASTOS DE", middleBoxX + 2, boxY + 4);
  doc.text("EMISIÓN S/", middleBoxX + 2, boxY + 8);
  doc.setFontSize(9);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506gastoformato_bd?.toString() ?? "0",
    middleBoxX + boxWidthLiq / 2,
    boxY + 12,
    { align: "center" }
  );

  // Símbolo =
  doc.setFontSize(12);
  doc.text(
    "=",
    middleBoxX + boxWidthLiq + boxSpacing / 2 - 1,
    boxY + boxHeightLiq / 2
  );

  // Tercera caja - Total a pagar (con borde más grueso)
  const endBoxX = middleBoxX + boxWidthLiq + boxSpacing;
  doc.setLineWidth(0.5);
  doc.rect(endBoxX, boxY, boxWidthLiq, boxHeightLiq);
  doc.setLineWidth(0.2);
  doc.setFontSize(8);
  doc.text("TOTAL A PAGAR", endBoxX + 2, boxY + 4);
  doc.text("ANUAL S/", endBoxX + 2, boxY + 8);
  doc.setFontSize(9);
  doc.text(
    determinacionarbitriosmunicipal[0]?.n0506arbitrioredondtotal_bd?.toString() ??
      "0",
    endBoxX + boxWidthLiq / 2,
    boxY + 12,
    { align: "center" }
  );

  // Cronograma de pagos
  const scheduleY = finalY + 35;
  doc.setFontSize(normalSize);
  doc.text("OPCIÓN PAGO FRACCIONADO S/.", marginLeft, scheduleY);

  // Tabla de cuotas
  const startX = marginLeft;
  const cuotaWidth = 20;
  const cuotaHeight = 10;
  let currentX = startX;
  let currentY = scheduleY + 4;

  // Primera fila de cuotas
  for (let i = 1; i <= 6; i++) {
    doc.rect(currentX, currentY, cuotaWidth, cuotaHeight);
    doc.text(`${i}° CUOTA`, currentX + 2, currentY + 4);
    const cuotaValue =
      Number(
        determinacionarbitriosmunicipal[0]?.n0506arbitrioredondtotal_bd ?? 0
      ) / 12;
    doc.text(cuotaValue.toFixed(2), currentX + 2, currentY + 8);
    if (i === 1) {
      const firstCuotaValue =
        cuotaValue +
        Number(determinacionarbitriosmunicipal[0]?.n0506gastoformato_bd ?? 0);
      doc.text(firstCuotaValue.toFixed(2), currentX + 2, currentY + 8);
    }
    currentX += cuotaWidth;
  }

  // Segunda fila de cuotas
  currentX = startX;
  currentY += cuotaHeight;
  for (let i = 7; i <= 12; i++) {
    doc.rect(currentX, currentY, cuotaWidth, cuotaHeight);
    doc.text(`${i}° CUOTA`, currentX + 2, currentY + 4);
    const cuotaValue =
      Number(
        determinacionarbitriosmunicipal[0]?.n0506arbitrioredondtotal_bd ?? 0
      ) / 12;
    doc.text(cuotaValue.toFixed(2), currentX + 2, currentY + 8);
    currentX += cuotaWidth;
  }

  // Número de serie
  doc.setFontSize(normalSize);
  doc.text("043198", contentWidth - 10, currentY + 15);

  doc.setFontSize(smallSize);
  doc.text(
    determinacionarbitriosmunicipal[0]?.msjpie_bd ?? "",
    marginLeft,
    currentY + 15
  );

  return doc;
}
