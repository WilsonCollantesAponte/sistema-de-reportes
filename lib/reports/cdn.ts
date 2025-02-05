import { jsPDF } from "jspdf";

export function generateCDN(
  portadaNotificacionResult: Array<{
    nombrecontrib_bd: string;
    lugar_bd: string;
    calle_bd: string;
    direccion_bd: string;
    distrito_bd: string;
    numpaquete: string;
    numhr: string;
    codigo_bd: string;
    anio_bd: number;
  }>,
  logo: Uint8Array
): jsPDF {
  const data = portadaNotificacionResult[0];
  const doc = new jsPDF({
    format: "a5",
    unit: "mm",
  });

  // Configuración de fuente - Reducir tamaño base global
  doc.setFont("helvetica");
  doc.setFontSize(5); // Reducido globalmente

  // Agregar logo (reducido)
  doc.addImage(logo, "JPEG", 115, 10, 23, 23);

  // Título (ligeramente reducido)
  doc.setFontSize(7);
  doc.text(`CARGO DE NOTIFICACION N° ${data.numhr ?? ""}`, 60, 8, {
    align: "center",
  });
  doc.setFontSize(5);

  // Código en la esquina superior derecha
  doc.text(`(CODIGO: ${data.codigo_bd?.trim() ?? ""})`, 115, 8);

  // Sección A con formato exacto de cajas (compactado)
  doc.text("A) FECHA Y HORA DE NOTIFICACION", 10, 12);
  doc.rect(10, 13, 95, 10); // Altura reducida

  // DIA
  doc.rect(15, 14, 15, 3);
  doc.text("DIA", 17, 16);
  doc.rect(30, 14, 4, 3);
  doc.rect(34, 14, 4, 3);

  // MES
  doc.rect(55, 14, 15, 3);
  doc.text("MES", 57, 16);
  doc.rect(70, 14, 4, 3);
  doc.rect(74, 14, 4, 3);

  doc.rect(15, 19, 15, 3);
  doc.text("HORA", 17, 21);
  doc.rect(30, 19, 4, 3);
  doc.rect(34, 19, 4, 3);
  doc.text(":", 40, 21);
  doc.rect(42, 19, 4, 3);
  doc.rect(46, 19, 4, 3);

  // AÑO
  doc.rect(55, 19, 15, 3);
  doc.text("AÑO", 57, 21);
  doc.rect(70, 19, 4, 3);
  doc.rect(74, 19, 4, 3);
  doc.rect(78, 19, 4, 3);
  doc.rect(82, 19, 4, 3);

  // Sección B - Espaciado reducido
  doc.text("B) IDENTIFICACION DE LA(S) PERSONA(S) NOTIFICADA(S)", 10, 26);
  doc.text("CONTRIBUYENTE", 10, 29);
  doc.text(`:${data.nombrecontrib_bd ?? ""}`, 40, 29);
  doc.text("DOMICILIO FISCAL", 10, 32);
  doc.text(`:${data.calle_bd ?? ""} ${data.direccion_bd ?? ""}`, 40, 32);
  doc.text(`${data.distrito_bd ?? ""}`, 40, 35);

  // Sección C - Espaciado reducido
  doc.text("C) IDENTIFICACION DEL RECEPTOR", 10, 38);
  doc.text("NOMBRE DEL RECEPTOR:", 10, 41);
  doc.line(45, 41, 140, 41);

  // Documento de identidad
  doc.text("DOCUMENTO DE IDENTIDAD:", 10, 44);
  for (let i = 0; i < 8; i++) {
    doc.rect(45 + i * 6, 42, 4, 4);
  }

  // Exhibe documento
  doc.text("EXHIBE DOC. IDENTIDAD", 10, 48);
  doc.rect(45, 46, 4, 4);
  doc.text("SI", 50, 48);
  doc.rect(60, 46, 4, 4);
  doc.text("NO", 65, 48);

  // Vínculo
  doc.text("VINCULO:", 10, 52);
  doc.rect(45, 50, 4, 4);
  doc.text("TITULAR", 50, 52);
  doc.rect(75, 50, 4, 4);
  doc.text("OTRO", 80, 52);
  doc.line(95, 52, 140, 52);

  // Contacto
  doc.text("TELEFONO:", 10, 56);
  doc.line(45, 56, 85, 56);
  doc.text("EMAIL:", 90, 56);
  doc.line(105, 56, 140, 56);

  // Sección D - Ajustada y compactada
  doc.text(
    "D) INFORME DEL NOTIFICADOR(Características predominantes del inmueble donde se notifica)",
    10,
    60
  );
  const tableY = 61;
  doc.rect(10, tableY, 130, 10);

  // Encabezados con bordes y texto centrado
  doc.rect(10, tableY, 25, 5);
  doc.rect(35, tableY, 25, 5);
  doc.rect(60, tableY, 25, 5);
  doc.rect(85, tableY, 25, 5);
  doc.rect(110, tableY, 30, 5);

  // Texto centrado en los encabezados
  doc.text("Color", 17, tableY + 3);
  doc.text("Material", 40, tableY + 3);
  doc.text("N° Pisos", 65, tableY + 3);
  doc.text("N° Sumin. Eléctrico", 87, tableY + 3);
  doc.text("Color y Material Puerta Principal", 112, tableY + 3);

  // Celdas para datos
  doc.rect(10, tableY + 5, 25, 5);
  doc.rect(35, tableY + 5, 25, 5);
  doc.rect(60, tableY + 5, 25, 5);
  doc.rect(85, tableY + 5, 25, 5);
  doc.rect(110, tableY + 5, 30, 5);

  // Sección E - Rediseñada más compacta
  const eY = 73;
  doc.setFontSize(4.5); // Reducción adicional del tamaño de fuente
  doc.text(
    "E) ACUSE DE NOTIFICACION: De conformidad con el inciso a) y f) del artículo 104 del Código Tributario se ha procedido a realizar la Notificacion con:",
    10,
    eY
  );

  // Contenedor principal de la sección E - Altura reducida
  const notifY = eY + 3;
  doc.rect(10, notifY, 130, 55); // Altura total reducida

  // División en tres columnas principales
  const colWidth = 43;

  // CEDULON
  doc.rect(10, notifY, colWidth, 5);
  doc.text("CEDULON", 20, notifY + 3);
  doc.rect(46, notifY + 0.5, 3, 3);

  // NEGATIVA
  doc.rect(53, notifY, colWidth, 5);
  doc.text("NEGATIVA", 65, notifY + 3);
  doc.rect(89, notifY + 0.5, 3, 3);

  // NO ENTREGA
  doc.rect(96, notifY, colWidth + 1, 5);
  doc.text("NO ENTREGA", 108, notifY + 3);
  doc.rect(132, notifY + 0.5, 3, 3);

  // Subtítulos - Espaciado reducido
  const subY = notifY + 5;

  // CEDULON subtítulo
  doc.rect(10, subY, colWidth, 5);
  doc.text("N° DE CEDULON", 15, subY + 3);

  // NEGATIVA subtítulo
  doc.rect(53, subY, colWidth, 5);
  doc.text("NEGATIVA A LA RECEPCION", 55, subY + 3);

  // NO ENTREGA subtítulo
  doc.rect(96, subY, colWidth + 1, 5);
  doc.text("DOCUMENTO NO NOTIFICADO", 98, subY + 3);

  // Contenido de las columnas - Espaciado reducido
  const contentY = subY + 5;

  // Columna CEDULON
  doc.rect(10, contentY, colWidth, 45);
  doc.text("Domicilio Cerrado", 12, contentY + 4);
  doc.rect(40, contentY + 1, 3, 3);

  doc.text("Ausencia de Persona Capaz", 12, contentY + 9);
  doc.rect(40, contentY + 6, 3, 3);

  // Subcajas CEDULON y AVISO PREVIO - Más compactas
  doc.rect(15, contentY + 13, 13, 12);
  doc.text("CEDULON", 16, contentY + 16);

  doc.rect(28, contentY + 13, 15, 12);
  doc.text("AVISO PREVIO", 29, contentY + 16);
  doc.text("SI", 29, contentY + 19);
  doc.rect(38, contentY + 17, 3, 3);
  doc.text("NO", 29, contentY + 23);
  doc.rect(38, contentY + 21, 3, 3);

  // Texto legal - Más compacto
  doc.setFontSize(4);
  const legalY = contentY + 27;
  doc.text(
    "De conformidad con el inciso b) del artículo 104° del Código Tributario en la fecha de la diligencia señalada en el presente cargo, se ha procedido a fijar el cedulón en el domicilio fiscal del Notificado por encontrarse cerrado. La presente acta se levanta para los efectos del artículo de No Acuse de Recibo (persona no capaz o Domicilio cerrado), por lo que se procedió a dejar el (los) documento(s) en sobre cerrado bajo la puerta del domicilio.",
    12,
    legalY,
    { maxWidth: 39, lineHeightFactor: 1 }
  );

  // Columna NEGATIVA
  doc.rect(53, contentY, colWidth, 45);
  doc.text("La persona encontrada en el domicilio fiscal", 55, contentY + 4);
  doc.text("Sr.:", 55, contentY + 8);
  doc.line(65, contentY + 8, 90, contentY + 8);

  doc.text("Rechazó la recepción del documento:", 55, contentY + 13);
  doc.rect(89, contentY + 10, 3, 3);

  doc.text("Recibió y se negó a suscribir el", 55, contentY + 18);
  doc.rect(89, contentY + 15, 3, 3);

  doc.text("Recibió y se negó a identificarse.", 55, contentY + 23);
  doc.text("(No brindó datos de indentificación)", 55, contentY + 26);
  doc.rect(89, contentY + 20, 3, 3);

  // Columna NO ENTREGA
  doc.rect(96, contentY, colWidth + 1, 45);
  doc.text("Terreno", 98, contentY + 4);
  doc.rect(132, contentY + 1, 3, 3);

  doc.text("Deshabitado/", 98, contentY + 9);
  doc.text("Abandonado", 98, contentY + 12);
  doc.rect(132, contentY + 6, 3, 3);

  doc.text("Direccion Incompleta", 98, contentY + 17);
  doc.rect(132, contentY + 14, 3, 3);

  doc.text("No ubicado el domicilio", 98, contentY + 22);
  doc.rect(132, contentY + 19, 3, 3);

  // OBSERVACIONES - Más compacto
  doc.text("OBSERVACIONES", 10, contentY + 47);
  doc.rect(10, contentY + 48, 130, 10);

  // Sección F - Ajustada y compactada
  const fY = contentY + 60;
  doc.text("F) NOTIFICADO POR CONSTANCIA ADMINISTRATIVA", 10, fY);
  doc.rect(130, fY - 2, 8, 8); // Checkbox reducido
  doc.setFontSize(4);
  doc.text("(Art. 104 inc c. del Código Tributario)", 10, fY + 3);
  doc.text(
    "Los documentos detallados en la sección G se entregaron, en la oficina de GERENCIA DE ADMINISTRACION TRIBUTARIA de la MUNICIPALIDAD DISTRITAL VEINTISEIS DE OCTUBRE\nsituada en Av. Prolongación Grau - Mz. N Lote 1 A.H. Las Capullanas - Veintiseis de Octubre .RUC:20529997401",
    10,
    fY + 6,
    { maxWidth: 130, lineHeightFactor: 1 }
  );
  doc.setFontSize(5);

  // Sección G - Espaciado reducido y compactado
  const gY = fY + 14;
  doc.text("G) DOCUMENTO(S) NOTIFICADO(S)", 10, gY);

  // Tabla de documentos
  const docY = gY + 2;
  doc.rect(10, docY, 8, 5);
  doc.rect(18, docY, 37, 5);
  doc.rect(55, docY, 30, 5);
  doc.rect(85, docY, 15, 5);
  doc.rect(100, docY, 40, 5);

  doc.text("N°", 11, docY + 3);
  doc.text("DOCUMENTO", 20, docY + 3);
  doc.text("N° DOCUMENTO", 57, docY + 3);
  doc.text("AÑO", 87, docY + 3);
  doc.text("CONCEPTO", 102, docY + 3);

  // Datos de la tabla
  const dataY = docY + 5;
  doc.rect(10, dataY, 8, 5);
  doc.rect(18, dataY, 37, 5);
  doc.rect(55, dataY, 30, 5);
  doc.rect(85, dataY, 15, 5);
  doc.rect(100, dataY, 40, 5);

  doc.text("1", 13, dataY + 3);
  doc.text("DJ Predial y Arbitrios", 20, dataY + 3);
  doc.text(`${data.numhr ?? ""}`, 57, dataY + 3);
  doc.text(`${data.anio_bd ?? ""}`, 87, dataY + 3);
  doc.text("Declar. Jurada Predial y Arbitrios", 102, dataY + 3);

  // Sección de firmas
  const firmasY = dataY + 18;

  // Línea para firma del receptor
  doc.line(10, firmasY, 60, firmasY);
  doc.text("RECEPTOR:", 10, firmasY + 2);
  doc.text("DNI:", 10, firmasY + 4);
  doc.line(20, firmasY + 4, 60, firmasY + 4);

  // Línea para firma del notificador
  doc.line(80, firmasY, 130, firmasY);
  doc.text("NOTIFICADOR:", 80, firmasY + 2);
  doc.text("DNI:", 80, firmasY + 4);
  doc.line(90, firmasY + 4, 130, firmasY + 4);

  // Número de serie alineado a la derecha
  doc.setFontSize(6);
  doc.text("043198", 140, firmasY + 4, { align: "right" });

  return doc;
}
