import prisma from "@/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mp_id_departamento = searchParams.get("mp_id_departamento");
  //   const tipoBusqueda = searchParams.get("tipoBusqueda") || 0;

  try {
    const result = await prisma.$queryRaw`
            SELECT * FROM fncobtenerProvincias(${mp_id_departamento},0)
        `;

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Error cargando provincias" }),
      { status: 500 }
    );
  }
}
