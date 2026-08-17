import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionId } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const versionId = body?.versionId as string | undefined;
  const stars = Number(body?.stars);

  if (!versionId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "Invalid versionId or stars (1-5)" }, { status: 400 });
  }

  const sessionId = getOrCreateSessionId();

  try {
    const rating = await prisma.rating.upsert({
      where: { versionId_sessionId: { versionId, sessionId } },
      update: { stars },
      create: { versionId, sessionId, stars },
    });

    const agg = await prisma.rating.aggregate({
      where: { versionId },
      _avg: { stars: true },
      _count: { stars: true },
    });

    return NextResponse.json({
      myVote: rating.stars,
      avg: agg._avg.stars,
      count: agg._count.stars,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected server error" },
      { status: 500 }
    );
  }
}
