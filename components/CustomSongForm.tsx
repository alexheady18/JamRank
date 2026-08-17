"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function CustomSongForm({ bandId }: { bandId: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = () => {
    const song = value.trim();
    if (!song) return;
    router.push(`/${bandId}/${encodeURIComponent(song)}`);
  };

  return (
    <div className="custom-form">
      <input
        className="custom-input"
        placeholder="Search any song…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button className="custom-go" onClick={submit} aria-label="Search song">
        <Search size={14} />
      </button>
    </div>
  );
}
