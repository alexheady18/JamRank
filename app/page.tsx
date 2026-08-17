import Link from "next/link";
import { BANDS } from "@/data/bands";

export default function Home() {
  return (
    <div className="wrap">
      <span className="eyebrow">Jam Band Tape Vault</span>
      <h1 className="title">REWIND</h1>
      <p className="sub">
        Rate every tape. Recordings are pulled live from the Internet Archive&apos;s etree
        collection — pick a band, pick a song, and stamp the versions you love.
      </p>

      <div className="band-grid">
        {BANDS.map((b) => (
          <Link key={b.id} href={`/${b.id}`} className="band-card">
            <span className="dot" style={{ background: b.accent, display: "block" }} />
            <div className="name">{b.name}</div>
            <div className="count">{b.songs.length} songs to start</div>
          </Link>
        ))}
      </div>

      <div className="footer-note">
        Recordings courtesy of the Internet Archive&apos;s live music collection (etree).
        Ratings are shared across every visitor. This is an independent fan project and isn&apos;t
        affiliated with any band, venue, or archive.org.
      </div>
    </div>
  );
}
