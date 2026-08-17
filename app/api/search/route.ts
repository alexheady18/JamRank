import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchArchiveVersions } from "@/lib/archive";
import { getBand, normalizeSong } from "@/data/bands";
import { getOrCreateSessionId } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bandId = searchParams.get("band") ?? "";
  const songLabel = (searchParams.get("song") ?? "").trim();

  const band = getBand(bandId);
  if (!band || !songLabel) {
    return NextResponse.json({ error: "Missing or invalid band/song" }, { status: 400 });
  }

  const song = normalizeSong(songLabel);
  const sessionId = getOrCreateSessionId();

  try {
    let versions = await prisma.version.findMany({
      where: { bandId, song },
      orderBy: { date: "asc" },
    });

    // First time this band+song has been requested: pull from Archive.org
    // and cache it so future visitors don't re-hit the API.
    if (versions.length === 0) {
      const docs = await fetchArchiveVersions(band.creators, songLabel);
      if (docs.length > 0) {
        await prisma.version.createMany({
          data: docs.map((d) => ({
            bandId,
            song,
            songLabel,
            identifier: d.identifier,
            title: d.title,
            date: d.date,
            venue: d.venue,
          })),
          skipDuplicates: true,
        });
        versions = await prisma.version.findMany({
          where: { bandId, song },
          orderBy: { date: "asc" },
        });
      }
    }

    const versionIds = versions.map((v) => v.id);
    const [aggregates, myVotes] = await Promise.all([
      prisma.rating.groupBy({
        by: ["versionId"],
        where: { versionId: { in: versionIds } },
        _avg: { stars: true },
        _count: { stars: true },
      }),
      prisma.rating.findMany({
        where: { versionId: { in: versionIds }, sessionId },
      }),
    ]);

    const aggMap = new Map(aggregates.map((a) => [a.versionId, a]));
    const myVoteMap = new Map(myVotes.map((v) => [v.versionId, v.stars]));

    const result = versions.map((v) => {
      const agg = aggMap.get(v.id);
      return {
        id: v.id,
        identifier: v.identifier,
        title: v.title,
        date: v.date,
        venue: v.venue,
        avg: agg?._avg.stars ?? null,
        count: agg?._count.stars ?? 0,
        myVote: myVoteMap.get(v.id) ?? null,
      };
    });

    return NextResponse.json({ versions: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected server error" },
      { status: 500 }
    );
  }
}
