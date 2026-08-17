import Link from "next/link";
import { notFound } from "next/navigation";
import { getBand } from "@/data/bands";
import VersionList from "@/components/VersionList";

export default function SongPage({ params }: { params: { band: string; song: string } }) {
  const band = getBand(params.band);
  if (!band) return notFound();
  const song = decodeURIComponent(params.song);

  return (
    <div className="wrap">
      <Link href={`/${band.id}`} className="back-link">
        ← {band.name}
      </Link>
      <span className="eyebrow">{band.name}</span>
      <VersionList bandId={band.id} song={song} />

      <div className="footer-note">
        Recordings courtesy of the Internet Archive&apos;s live music collection (etree). Ratings
        are shared across every visitor. This is an independent fan project and isn&apos;t
        affiliated with any band, venue, or archive.org.
      </div>
    </div>
  );
}
