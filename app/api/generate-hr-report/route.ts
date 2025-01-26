import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateHRPdf } from "@/utils/generate-hr-pdf";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");

  if (!codigo) {
    return NextResponse.json(
      { error: "Missing required parameter: codigo" },
      { status: 400 }
    );
  }

  try {
    // Fetch contributor data
    const contributor = await prisma.$queryRaw`
      SELECT * FROM fncobtenerpaqueteporlugar(${codigo}, 0, 1)
    `;

    if (!contributor || contributor.length === 0) {
      return NextResponse.json(
        { error: "Contributor not found" },
        { status: 404 }
      );
    }

    // Fetch additional data needed for the PDF
    const hrInfo = await prisma.$queryRaw`
      SELECT * FROM fncobtenerhrmasivoreporte(${codigo}, 3)
    `;

    const hrReport = await prisma.$queryRaw`
      SELECT * FROM fncobtenerreportehojaresumen(${hrInfo[0].numhr})
    `;

    const titulares = await prisma.$queryRaw`
      SELECT * FROM fncobtenertitularreportehr(${hrInfo[0].numhr})
    `;

    const domicilio = await prisma.$queryRaw`
      SELECT * FROM fncobtenerdomiciliofiscalcadena(${codigo})
    `;

    const predios = await prisma.$queryRaw`
      SELECT * FROM fncobtenerreportehrvaluopredios(${hrInfo[0].numhr})
    `;

    // Prepare the data for the PDF generation
    const contribuyente = {
      apellidosNombres: titulares[0].apellidosnombres,
      dniRuc: contributor[0].dni_ruc,
      codigo: contributor[0].codigo,
      domicilioFiscal: domicilio[0].domicilio,
      predios: predios.map((predio: any) => ({
        unidadCatastral: predio.unidad_catastral,
        ubicacion: predio.ubicacion,
        valorPredio: predio.valor_predio,
      })),
    };

    // Generate the PDF
    const result = await generateHRPdf(contribuyente);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    // Read the generated PDF file
    const fs = require("fs").promises;
    const pdfBuffer = await fs.readFile(result.downloadPath);

    // Set the appropriate headers for PDF download
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${result.fileName}"`
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating HR report:", error);
    return NextResponse.json(
      { error: "Error generating HR report" },
      { status: 500 }
    );
  }
}
