import { NextRequest } from "next/server";
import { getPackageById, getPackageComponents } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pkg = getPackageById(id);

  if (!pkg) {
    return Response.json({ error: "Package not found" }, { status: 404 });
  }

  const components = getPackageComponents(id);

  return Response.json({ package: pkg, components });
}
