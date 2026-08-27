import { NextRequest } from "next/server";
import { reprice } from "@/lib/pricing";
import { getPackageById, getPackageComponents, getGuide } from "@/lib/db";
import type { PackageComponent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let basePrice: string;
    let currency: string;
    let components: PackageComponent[];
    let guideDayRate: string | null = null;
    let days: number;

    if (body.package_id) {
      const pkg = getPackageById(body.package_id);
      if (!pkg) {
        return Response.json({ error: "Package not found" }, { status: 404 });
      }
      basePrice = pkg.base_price;
      currency = pkg.currency;
      days = pkg.duration_days;

      const allComps = getPackageComponents(body.package_id);
      const selectedIds = body.selected_components || [];
      components = allComps.filter(
        (c) =>
          c.is_optional !== 1 || selectedIds.includes(c.component_id)
      );

      if (body.guide_id) {
        const guide = getGuide(body.guide_id);
        if (guide) {
          guideDayRate = guide.day_rate;
          days = pkg.duration_days;
        }
      }
    } else {
      basePrice = body.basePrice;
      currency = body.currency;
      components = body.components || [];
      guideDayRate = body.guideDayRate || null;
      days = body.days;
    }

    if (!basePrice || !currency || !Array.isArray(components) || !days) {
      return Response.json(
        { error: "Missing required fields: basePrice, currency, components, days" },
        { status: 400 }
      );
    }

    const result = reprice(
      String(basePrice),
      String(currency),
      components as PackageComponent[],
      guideDayRate ? String(guideDayRate) : null,
      Number(days)
    );
    return Response.json(result);
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
