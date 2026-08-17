export type Band = {
  id: string;
  name: string;
  creators: string[]; // archive.org "creator" field values to match against
  accent: string;
  songs: string[];
};

export const BANDS: Band[] = [
  {
    id: "gd",
    name: "Grateful Dead",
    creators: ["Grateful Dead"],
    accent: "#d9a441",
    songs: [
      "Dark Star",
      "Scarlet Begonias",
      "Fire on the Mountain",
      "Terrapin Station",
      "Eyes of the World",
      "Playing in the Band",
      "China Cat Sunflower",
      "The Other One",
      "Help on the Way",
      "Slipknot!",
    ],
  },
  {
    id: "phish",
    name: "Phish",
    creators: ["Phish"],
    accent: "#2f8f83",
    songs: [
      "Tweezer",
      "You Enjoy Myself",
      "Down with Disease",
      "Ghost",
      "Simple",
      "Piper",
      "Mike's Song",
      "Weekapaug Groove",
      "Bathtub Gin",
      "Sand",
      "Reba",
      "Harry Hood",
      "Chalk Dust Torture",
      "Fluffhead",
    ],
  },
  {
    id: "wsp",
    name: "Widespread Panic",
    creators: ["Widespread Panic"],
    accent: "#c1442a",
    songs: [
      "Postcard",
      "Space Wrangler",
      "Ain't Life Grand",
      "Diner",
      "Chilly Water",
      "Pigeons",
      "Fishwater",
      "Wondering",
      "Rebirtha",
      "Driving Song",
      "Papa's Home",
      "Travelin' Man",
    ],
  },
  {
    id: "umphreys",
    name: "Umphrey's McGee",
    creators: ["Umphrey's McGee", "Umphreys McGee"],
    accent: "#7a6fd9",
    songs: [
      "Mantis",
      "Bridgeless",
      "1348",
      "Ringo",
      "In the Kitchen",
      "Wappy Sprayberry",
      "Push the Pig",
      "Divisions",
      "The Triple Wide",
      "Front Porch",
    ],
  },
  {
    id: "goose",
    name: "Goose",
    creators: ["Goose"],
    accent: "#3f9142",
    songs: [
      "Hungersite",
      "Arcadia",
      "Butter Rap",
      "Yeti",
      "Rockdale",
      "Slow Ready",
      "Old Man & the Tree",
      "All I Need",
      "Silver Rising",
    ],
  },
  {
    id: "sts9",
    name: "STS9",
    creators: ["Sound Tribe Sector 9", "STS9", "Sound Tribe Sector Nine"],
    accent: "#3a7fc1",
    songs: [
      "Aer",
      "Breathe In",
      "Where Dreams Find Home",
      "Cataly",
      "EHM",
      "Fonte",
      "Cane Steel",
      "Hidden Hand",
      "Kamuy",
    ],
  },
];

export function getBand(id: string): Band | undefined {
  return BANDS.find((b) => b.id === id);
}

export function normalizeSong(song: string): string {
  return song.trim().toLowerCase();
}
