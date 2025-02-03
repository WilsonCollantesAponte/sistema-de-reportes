import prisma from "@/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mp_id_provincia = searchParams.get("mp_id_provincia");
  try {
    const result = await prisma.$queryRaw`
            select * from fncobtenerdistritos(${mp_id_provincia},0)
        `;

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Error cargando distritos" },
      { status: 500 }
    );
  }
}
