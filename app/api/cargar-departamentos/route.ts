import prisma from "@/db";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      select * from fncobtenerDepartamentos()
    `;

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error cargando departamentos" },
      { status: 500 }
    );
  }
}
