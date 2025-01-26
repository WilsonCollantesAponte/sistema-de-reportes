import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lugar = searchParams.get("lugar");
  const inicio = searchParams.get("inicio");
  const fin = searchParams.get("fin");

  if (!lugar || !inicio || !fin) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const contributors = await prisma.$queryRaw`
      SELECT * FROM fncobtenerpaqueteporlugar(${lugar}, ${Number.parseInt(
      inicio
    )}, ${Number.parseInt(fin)})
    `;

    return NextResponse.json(contributors);
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return NextResponse.json(
      { error: "Error fetching contributors" },
      { status: 500 }
    );
  }
}
