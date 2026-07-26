import { NextResponse } from "next/server";
import { getPublicServices } from "../../../app/_services";

/** Thin HTTP boundary: resolve composition, call the use-case, map Result to HTTP. */
export async function listPublishedProgrammes(): Promise<NextResponse> {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();

  return result.ok
    ? NextResponse.json({ programmes: result.value })
    : NextResponse.json({ error: result.error.message, code: result.error.code }, { status: 500 });
}
