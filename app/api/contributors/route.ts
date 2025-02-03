import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lugar = searchParams.get("lugar") || "";
  const year = searchParams.get("year") || "2024";
  const inicio = Number(searchParams.get("inicio") || "0");
  const fin = Number(searchParams.get("fin") || "200");
  const searchText = `${lugar}|${year}`;

  try {
    console.log({ inicio, fin, searchText });

    const result = await prisma.$queryRaw`
      select * from fncobtenerpaqueteporlugar(${searchText},0,20)
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return NextResponse.json(
      { error: "Error fetching contributors" },
      { status: 500 }
    );
  }
}
