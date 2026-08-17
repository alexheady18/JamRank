import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchArchiveVersions } from "@/lib/archive";
import { getBand, normalizeSong } from "@/data/bands";

/**
 * Re-pulls fresh results from Archive.org for a band+song and merges in
 * any new recordings (existing ratings are untouched — matched on the
 * archive.org identifier, which is stable).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const bandId = body?.bandId as string | undefined;
  const songLabel = (body?.song as string | undefined)?.trim();

  const band = bandId ? getBand(bandId) : undefined;
  if (!band || !songLabel) {
    return NextResponse.json({ error: "Missing or invalid band/song" }, { status: 400 });
  }

  const song = normalizeSong(songLabel);

  try {
    const docs = await fetchArchiveVersions(band.creators, songLabel);
    if (docs.length > 0) {
      await prisma.version.createMany({
        data: docs.map((d) => ({
          bandId: band.id,
          song,
          songLabel,
          identifier: d.identifier,
          title: d.title,
          date: d.date,
          venue: d.venue,
        })),
        skipDuplicates: true,
      });
    }
    return NextResponse.json({ added: docs.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected server error" },
      { status: 500 }
    );
  }
}
