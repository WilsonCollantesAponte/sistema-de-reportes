import prisma from "@/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_lugar = searchParams.get("id_lugar")?.slice(0, -3);
    const year = searchParams.get("year");
    const nombre_lugar = searchParams.get("nombre_lugar")?.toUpperCase();

    // console.log({ id_lugar, year, nombre_lugar });

    const result = await prisma.$queryRaw`
       SELECT * FROM fncobtenerlugarespornombre_hr(${id_lugar},${nombre_lugar},${year})
    `;

    console.log({ result });

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return Response.json(
      { error: "Error fetching contributors" },
      { status: 500 }
    );
  }
}
