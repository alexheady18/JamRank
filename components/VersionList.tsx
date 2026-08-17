"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, RotateCcw } from "lucide-react";
import StarRow from "./StarRow";
import Counter from "./Counter";

type Version = {
  id: string;
  identifier: string;
  title: string;
  date: string | null;
  venue: string | null;
  avg: number | null;
  count: number;
  myVote: number | null;
};

export default function VersionList({ bandId, song }: { bandId: string; song: string }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [sortMode, setSortMode] = useState<"rating" | "date">("rating");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/search?band=${bandId}&song=${encodeURIComponent(song)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setVersions(data.versions);
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong.");
    }
  }, [bandId, song]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRate = async (versionId: string, stars: number) => {
    setVersions((prev) =>
      prev.map((v) => (v.id === versionId ? { ...v, myVote: stars } : v))
    );
    try {
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId, stars }),
      });
      const data = await res.json();
      if (res.ok) {
        setVersions((prev) =>
          prev.map((v) =>
            v.id === versionId ? { ...v, avg: data.avg, count: data.count, myVote: data.myVote } : v
          )
        );
      }
    } catch {
      // optimistic UI already applied; a page refresh will resync
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bandId, song }),
      });
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const sorted = [...versions].sort((a, b) => {
    if (sortMode === "rating") {
      if (a.avg == null && b.avg == null) return (a.date || "").localeCompare(b.date || "");
      if (a.avg == null) return 1;
      if (b.avg == null) return -1;
      return b.avg - a.avg || b.count - a.count;
    }
    return (a.date || "").localeCompare(b.date || "");
  });

  return (
    <>
      <div className="list-head">
        <div className="list-title">{song}</div>
        <div className="sort-toggle">
          <button className={sortMode === "rating" ? "active" : ""} onClick={() => setSortMode("rating")}>
            Top Rated
          </button>
          <button className={sortMode === "date" ? "active" : ""} onClick={() => setSortMode("date")}>
            By Date
          </button>
          <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "Refresh from Archive.org"}
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="state-msg loading">
          <Loader2 size={16} className="spin" />
          Digging through the tape vault…
        </div>
      )}

      {status === "error" && (
        <div className="state-msg error">
          Couldn&apos;t load versions: {errorMsg}
          <div>
            <button className="retry-btn" onClick={load}>
              <RotateCcw size={13} /> Try again
            </button>
          </div>
        </div>
      )}

      {status === "done" && sorted.length === 0 && (
        <div className="state-msg">
          No taped versions turned up for &quot;{song}&quot; yet. Try another song, or check the
          spelling — matching is based on each recording&apos;s setlist text.
        </div>
      )}

      {status === "done" && sorted.length > 0 && (
        <div className="version-grid">
          {sorted.map((v) => (
            <div className="version-card" key={v.id}>
              <div className="card-top">
                <div>
                  <div className="card-venue">{v.venue}</div>
                  <div className="card-date">{v.date || "date unknown"}</div>
                </div>
                <Counter value={v.avg} />
              </div>
              <div className="card-bottom">
                <div>
                  <StarRow value={v.myVote || 0} onRate={(stars) => handleRate(v.id, stars)} />
                  <div className="vote-count">
                    {v.count} {v.count === 1 ? "vote" : "votes"}
                  </div>
                </div>
                <a
                  className="card-link"
                  href={`https://archive.org/details/${v.identifier}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open on Archive.org"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
