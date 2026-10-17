import { getListing } from "@/lib/data";

export async function GET() {
  return Response.json(getListing());
}
