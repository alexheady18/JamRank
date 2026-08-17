import Link from "next/link";
import { notFound } from "next/navigation";
import { getBand } from "@/data/bands";
import CustomSongForm from "@/components/CustomSongForm";

export default function BandPage({ params }: { params: { band: string } }) {
  const band = getBand(params.band);
  if (!band) return notFound();

  return (
    <div className="wrap">
      <Link href="/" className="back-link">
        ← All bands
      </Link>
      <span className="eyebrow">{band.name}</span>
      <h1 className="title" style={{ fontSize: 34 }}>
        Pick a song
      </h1>

      <div className="song-bar">
        {band.songs.map((s) => (
          <Link key={s} href={`/${band.id}/${encodeURIComponent(s)}`} className="song-chip">
            {s}
          </Link>
        ))}
        <CustomSongForm bandId={band.id} />
      </div>

      <div className="footer-note">
        Don&apos;t see the song you&apos;re after? Use the search box above — it works for any
        song title, not just the starter list.
      </div>
    </div>
  );
}
