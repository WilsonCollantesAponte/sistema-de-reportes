import prisma from "@/db";
import { generateCARTA } from "@/lib/reports/carta";
import { generateCDN } from "@/lib/reports/cdn";
import { generateDAM } from "@/lib/reports/dam";
import { generateHR } from "@/lib/reports/hr";
import { generateHRA } from "@/lib/reports/hra";
import { generatePR } from "@/lib/reports/pr";
import { generatePU } from "@/lib/reports/pu";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib"; // Importar pdf-lib para fusionar pdf´s

export async function POST(request: Request) {
  try {
    const { codContribuyente, year, starWithLetter, fin } =
      await request.json();
    const searchText = `${codContribuyente}|${year}`;
    const num_fin = Number(fin);

    const logo: { fncobtenerparametrosimagenparam: Uint8Array }[] =
      await prisma.$queryRaw`
      select * from fncobtenerparametrosimagenparam('4','0') LIMIT 1
    `;

    if (starWithLetter) {
      const result: Array<{
        result: string;
        c0505anio: string;
        c0001idlugar: string;
        c0001codpersona: string;
      }> = await prisma.$queryRaw`
      select * from fncobtenerpaqueteporlugar(${searchText},0,5000) limit ${num_fin}
    `;

      const pdfs: Array<Uint8Array<ArrayBufferLike>> = [];

      for (const item of result) {
        const mergedPdfBytes = await createMergedPDF_paraUnContribudor(
          item.c0001codpersona,
          item.c0505anio,
          logo[0].fncobtenerparametrosimagenparam
        );

        // Aquí puedes hacer algo con cada PDF generado, como guardarlo en el sistema de archivos o enviarlo a otro servicio
        pdfs.push(mergedPdfBytes);
      }

      const mergedPdf = await PDFDocument.create();

      for (const pdfBytes of pdfs) {
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();

      return new Response(mergedPdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    }

    const mergedPdfBytes = await createMergedPDF_paraUnContribudor(
      codContribuyente,
      year,
      logo[0].fncobtenerparametrosimagenparam
    );

    // Devolver el PDF fusionado como respuesta
    return new Response(mergedPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        // "Content-Disposition": "attachment; filename=merged_document.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return Response.json({ error: "Error generating report" }, { status: 500 });
  }
}

async function createMergedPDF_paraUnContribudor(
  codContribuyente: string,
  year: string,
  logo: Uint8Array
) {
  const searchText = `${codContribuyente}|${year}`;

  // Crear un array para almacenar los documentos PDF generados
  const pdfDocuments: jsPDF[] = [];

  // eslint-disable-next-line
  const portadaNotificacionResult: any = await prisma.$queryRaw`
      SELECT * FROM fncobtenerdatosportada(${searchText})
    `;

  const doc = generateCDN(portadaNotificacionResult, logo);
  pdfDocuments.push(doc); // Agregar el primer documento al array

  const carta = generateCARTA(portadaNotificacionResult, logo);
  pdfDocuments.push(carta);

  // HR -------------------------------------
  const hrResult: Array<{ numhr: string; codcont: string }> =
    await prisma.$queryRaw`
      select * from fncobtenerhrmasivoreporte(${searchText},'3')
    `;

  const numhr = hrResult[0]?.numhr;
  if (!numhr) {
    console.warn("HR report number not found");
  } else {
    // eslint-disable-next-line
    const hojaResumenResult: Array<{ base_imponible: number }> | any =
      await prisma.$queryRaw`
      select * from fncobtenerreportehojaresumen(${numhr})
    `;

    // eslint-disable-next-line
    const titularesResult: any = await prisma.$queryRaw`
      select * from fncobtenertitularreportehr(${numhr})
    `;

    // eslint-disable-next-line
    const domiciliosResult: any = await prisma.$queryRaw`
      select * from fncobtenerdomiciliofiscalcadena(${codContribuyente})
    `;

    // eslint-disable-next-line
    const prediosResult: any = await prisma.$queryRaw`
      select * from fncobtenerreportehrvaluopredios(${numhr})
    `;

    // falta hacerlo dinámico
    // eslint-disable-next-line
    const footerResult: any = await prisma.$queryRaw`
      select * from fncobtenerimpuestoxtramosvaluo('8753.56','2024')
        `;

    const hr = generateHR({
      hrResult,
      hojaResumenResult,
      titularesResult,
      domiciliosResult,
      prediosResult,
      footerResult,
      logo,
    });

    pdfDocuments.push(hr); // Agregar el documento HR al array
  }

  // PU -------------------------------------
  const puResult: Array<{ numpu: string; codcont: string }> =
    await prisma.$queryRaw`
      select * from fncobtenerpumasivoreporte(${searchText},'2')
    `;

  const numpu = puResult[0]?.numpu;
  if (!numpu) {
    console.warn("PU report number not found, skipping PU related queries");
  } else {
    // eslint-disable-next-line
    const puReportResult: any = await prisma.$queryRaw`
      select * from fncobtenerreportepu(${numpu})
      `;

    // eslint-disable-next-line
    const puTitularesResult: any = await prisma.$queryRaw`
      select * from fncobtenertitularreporteprediurbano(${numpu})
      `;

    // eslint-disable-next-line
    const puUbicacionesResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteubicacionprediopu(${numpu})
      `;

    // eslint-disable-next-line
    const puDatosPredioResult: any = await prisma.$queryRaw`
      select * from fncobtenerreportedatosprediopu(${numpu})
      `;

    // eslint-disable-next-line
    const puConstruccionesResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteconstruccionpu(${numpu})
      `;

    // eslint-disable-next-line
    const puOtrasConstruccionesResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteotrosinstalacionespu(${numpu})
      `;

    const pu = generatePU(
      puResult,
      puReportResult,
      puTitularesResult,
      puUbicacionesResult,
      puDatosPredioResult,
      puConstruccionesResult,
      puOtrasConstruccionesResult,
      logo
    );

    pdfDocuments.push(pu); // Agregar el documento PU al array
  }

  // PR -------------------------------------
  const prResult: Array<{ numpr: string; codcont: string }> =
    await prisma.$queryRaw`
      select * from fncobtenervaluopredioruralmasivo(${searchText}, '2')
    `;

  const numpr = prResult[0]?.numpr;
  if (!numpr) {
    console.warn("PR report number not found");
  } else {
    // eslint-disable-next-line
    const prReportResult: any = await prisma.$queryRaw`
      select * from fncobtenervaluoprediorural(${numpr}, 'RR')
      `;

    // eslint-disable-next-line
    const prTitularesResult: any = await prisma.$queryRaw`
      select * from fncobtenertitularreporteprediorural(${numpr})
      `;

    // eslint-disable-next-line
    const prUbicacionesResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteubicacionpredioprediorural(${numpr})
      `;

    // eslint-disable-next-line
    const prDatosPredioResult: any = await prisma.$queryRaw`
      select * from fncobtenerreportedatosprediorural(${numpr})
      `;

    // eslint-disable-next-line
    const prGrupoTierraResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteprediruralvalorgrupotierra(${numpr}, 'R')
      `;

    // eslint-disable-next-line
    const prConstruccionesResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteconstruccionprediorural(${numpr})
      `;

    // eslint-disable-next-line
    const prOtrasConstruccionesResult: any = await prisma.$queryRaw`
      select * from fncobtenerreporteotrosinstalacionesprediorural(${numpr})
      `;

    const pr = generatePR(
      prResult,
      prReportResult,
      prTitularesResult,
      prUbicacionesResult,
      prDatosPredioResult,
      prGrupoTierraResult,
      prConstruccionesResult,
      logo
    );

    pdfDocuments.push(pr); // Agregar el documento PR al array
  }

  // HRA -------------------------------------
  const hraResult: Array<{ numhra: string; codcont: string }> =
    await prisma.$queryRaw`
      select * from fncobtenerhramasivoreporte(${searchText}, '3')
    `;

  const numhra = hraResult[0]?.numhra;
  if (!numhra) {
    console.warn("HRA report number not found");
  } else {
    // eslint-disable-next-line
    const hraHojaResumenResult: Array<{ base_imponible: number }> | any =
      await prisma.$queryRaw`
        select * from fncobtenerdeterminacionarbitriosmunicipalhojaresumen(${numhra}, 'R') limit 1
      `;

    // eslint-disable-next-line
    const hraTitularesResult: any = await prisma.$queryRaw`
        select * from fncobtenerdeterminacionarbitriohojaresumentitularreporte(${numhra})
      `;

    // eslint-disable-next-line
    const hraDomiciliosResult: any = await prisma.$queryRaw`
        select * from fncobtenerdomiciliofiscalcadena(${codContribuyente})
      `;

    const hraPrediosResult:
      | Array<{
          c0500id_uni_cat: string;
          ubicacion: string;
          n0500porctit: number;
          limpiezaredond: number;
          areasverdesredond: number;
          serenazgoredond: number;
          gastoemision: number;
        }>
      // eslint-disable-next-line
      | any = await prisma.$queryRaw`
        select * from fncobtenerdeterminacionarbitriospdhojaresumen(${numhra})
      `;

    const totalArbitriosMunicipales = hraPrediosResult.reduce(
      // eslint-disable-next-line
      (total: any, predio: any) => {
        return (
          total +
          Number(predio.limpiezaredond) +
          Number(predio.areasverdesredond) +
          Number(predio.serenazgoredond) +
          Number(predio.gastoemision)
        );
      },
      0
    );

    const hra = generateHRA(
      hraResult,
      hraHojaResumenResult,
      hraTitularesResult,
      hraDomiciliosResult,
      hraPrediosResult,
      { totalArbitriosMunicipales: String(totalArbitriosMunicipales) },
      logo
    );

    pdfDocuments.push(hra); // Agregar el documento HRA al array
  }

  // DAM -------------------------------------
  const damResult: Array<{ numdam: string; codcont: string }> =
    await prisma.$queryRaw`
      select * from fncobtenerdammasivoreporte(${searchText}, '3')
    `;

  const numdam = damResult[0]?.numdam;
  if (!numdam) {
    console.warn("DAM report number not found");
  } else {
    // eslint-disable-next-line
    const dam_masivo_reporte: any = await prisma.$queryRaw`
    select * from fncobtenerdammasivoreporte(${numdam},'C')
    `;

    // eslint-disable-next-line
    const determinacionarbitriosmunicipal: any = await prisma.$queryRaw`
     select * from fncobtenerdeterminacionarbitriosmunicipal(${numdam},'R')
    `;

    // eslint-disable-next-line
    const determinacionarbitriotitularreporte: any = await prisma.$queryRaw`
    select * from fncobtenerdeterminacionarbitriotitularreporte(${numdam})
    `;

    // eslint-disable-next-line
    const determinacionarbitriodomiciliofiscaltitulardam: any =
      await prisma.$queryRaw`
    select * from fncobtenerdeterminacionarbitriodomiciliofiscaltitulardam(${numdam})
    `;

    // eslint-disable-next-line
    const determinacionarbitrioubicacionprediodam: any = await prisma.$queryRaw`
    select * from fncobtenerdeterminacionarbitrioubicacionprediodam(${numdam})
    `;

    // eslint-disable-next-line
    const determinacionarbitriousosprediosdam: any = await prisma.$queryRaw`
    select * from fncobtenerdeterminacionarbitriousosprediosdam(${numdam})
    `;

    const dam = generateDAM(
      dam_masivo_reporte,
      determinacionarbitriosmunicipal,
      determinacionarbitriotitularreporte,
      determinacionarbitriodomiciliofiscaltitulardam,
      determinacionarbitrioubicacionprediodam,
      determinacionarbitriousosprediosdam,
      logo
    );

    pdfDocuments.push(dam); // Agregar el documento DAM al array
  }

  // Fusionar todos los documentos PDF
  const mergedPdf = await PDFDocument.create();

  for (const pdfDoc of pdfDocuments) {
    const pdfBytes = pdfDoc.output("arraybuffer");
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Guardar el PDF fusionado en un buffer
  const mergedPdfBytes = await mergedPdf.save();

  return mergedPdfBytes;
}
