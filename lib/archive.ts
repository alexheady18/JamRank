export type ArchiveDoc = {
  identifier: string;
  title: string;
  date: string;
  venue: string;
};

/**
 * Pulls live recordings from the Internet Archive's etree (live music)
 * collection for a given band + song.
 *
 * Archive.org has no per-track search API, so this matches against each
 * recording's title/description text (which for etree uploads usually
 * includes the setlist). It's heuristic, not exact — good enough to
 * surface strong candidates, not a guarantee every result is a perfect
 * match or that no version is missed.
 */
export async function fetchArchiveVersions(
  creators: string[],
  song: string
): Promise<ArchiveDoc[]> {
  const creatorClause = creators.map((c) => `creator:("${c}")`).join(" OR ");
  const safeSong = song.replace(/"/g, "");
  const q = `collection:(etree) AND (${creatorClause}) AND "${safeSong}"`;

  const url =
    "https://archive.org/advancedsearch.php?q=" +
    encodeURIComponent(q) +
    "&fl[]=identifier&fl[]=title&fl[]=date&fl[]=venue&fl[]=coverage" +
    "&sort[]=date+asc&rows=50&page=1&output=json";

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Archive.org request failed (${res.status})`);
  }
  const data = await res.json();
  const docs = data?.response?.docs ?? [];

  return docs.map((d: any) => ({
    identifier: d.identifier,
    title: d.title || d.identifier,
    date: (d.date || "").slice(0, 10),
    venue: d.venue || d.coverage || "Venue unknown",
  }));
}
