import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { deflateRawSync, inflateRawSync } from "node:zlib";

const outputPath = new URL("../public/data/app-data.json", import.meta.url);
const forumApi = "https://www.fcmobileforum.com/api/v1";
const positions = ["ST", "LW", "RW", "CAM", "CM", "CDM", "LM", "RM", "LB", "RB", "CB", "GK"];

async function fetchJson(url, referer = "https://www.fcmobileforum.com/") {
  if (process.env.FCMADDICT_OFFLINE === "1") {
    throw new Error("Offline snapshot test");
  }
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      referer,
      "user-agent": "FCMaddict-Website/1.0",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function list(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.Items)) return payload.Items;
  return [];
}

function text(value) {
  return value == null ? "" : String(value).trim();
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseReview(item) {
  return {
    id: number(item.id),
    slug: text(item.urlSlug),
    name: text(item.playerName) || "Unknown",
    position: text(item.position) || "-",
    event: text(item.eventName) || "Review",
    image: text(item.playerImage),
    rating: number(item.rating),
    weakFoot: text(item.weakFoot),
    skillMoves: text(item.skillMove),
    stamina: number(item.stamina),
    pros: text(item.pros),
    cons: text(item.cons),
    verdict: text(item.finalVerdict),
    skillPoints: [item.skillPoints1, item.skillPoints2, item.skillPoints3, item.skillpoints_4]
      .map(text)
      .filter(Boolean),
    alternatives: [item.alternative1, item.alternative2, item.alternative3]
      .map(text)
      .filter(Boolean),
    playstyles: [item.playstyle_1, item.playstyle_2, item.playstyle_3]
      .map(text)
      .filter(Boolean),
    author: text(item.playerReviews_item),
    createdDate: text(item.createdDate),
    stats: Array.from({ length: 6 }, (_, index) => ({
      label: text(item[`statsType${index + 1}`]) || `Stat ${index + 1}`,
      value: number(item[`stats${index + 1}`]),
    })),
  };
}

function parseRankGroup(payload, position, maxCards) {
  const item = list(payload).find(
    (candidate) => text(candidate.title).toUpperCase() === position,
  );
  if (!item) return { updatedAt: "", cards: [] };
  return {
    updatedAt: text(item.updatedDate),
    cards: Array.from({ length: maxCards }, (_, index) => index + 1)
      .map((rank) => ({
        rank,
        name: text(item[`name_${rank}`]),
        image: text(item[`img_${rank}`]),
        marketValue: text(item[`mv${rank}`]),
        weakFoot: text(item[`wf${rank}`]),
        skillMoves: text(item[`sm${rank}`]),
        stamina: text(item[`st${rank}`]),
        reviewLink: text(item[`rlink${rank}`]),
      }))
      .filter((card) => card.name),
  };
}

function encodeRenderzQuery(payload) {
  return deflateRawSync(JSON.stringify(payload)).toString("base64url");
}

function decodeRenderzResponse(encoded) {
  const bytes = Buffer.from(encoded, "base64url");
  for (let index = 0; index < bytes.length; index += 1) {
    const value = bytes[index];
    bytes[index] = ((value >> 3) | (value << 5)) & 0xff;
  }
  if (bytes.length < 4 || bytes[0] !== 1) {
    throw new Error("Unsupported RenderZ response");
  }
  const salt = (bytes[1] << 8) | bytes[2];
  const key = createHash("sha256")
    .update(`renderz-search-scramble-v1:${salt}`)
    .digest();
  const compressed = Buffer.alloc(bytes.length - 3);
  for (let index = 0; index < compressed.length; index += 1) {
    compressed[index] = bytes[index + 3] ^ key[index % key.length];
  }
  return JSON.parse(inflateRawSync(compressed).toString("utf8"));
}

async function fetchLatestPlayers() {
  const query = {
    query: { bool: { must: [], should: [], must_not: [] } },
    sort: [{ added: { order: "desc" } }, { assetId: { order: "desc" } }],
    _source: [],
    from: 0,
    size: 120,
  };
  const endpoint = new URL("https://renderz.app/api/search/elasticsearch");
  endpoint.searchParams.set("v", "1");
  endpoint.searchParams.set("q", encodeRenderzQuery(query));
  const encoded = await fetchJson(
    endpoint,
    "https://renderz.app/24/players?sortType=added",
  );
  if (typeof encoded !== "string") throw new Error("Invalid RenderZ payload");
  const decoded = decodeRenderzResponse(encoded);
  return list(decoded.players).map((item) => {
    const images = item.images && typeof item.images === "object" ? item.images : {};
    const avgStats = item.avgStats && typeof item.avgStats === "object" ? item.avgStats : {};
    return {
      id: number(item.assetId ?? item.id),
      name: text(item.cardName ?? item.name),
      rating: number(item.rating),
      position: text(item.position),
      added: text(item.added),
      auctionable: item.auctionable === true,
      image: text(images.playerCardImage),
      club: text(item.club?.name),
      nation: text(item.nation?.name),
      program: text(item.source).replace(/^PROGRAM_/, "").replaceAll("_", " "),
      stats: {
        pace: number(avgStats.avg1),
        shooting: number(avgStats.avg2),
        passing: number(avgStats.avg3),
        dribbling: number(avgStats.avg4),
        defending: number(avgStats.avg5),
        physical: number(avgStats.avg6),
      },
    };
  }).filter((player) => player.id && player.name);
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return {};
  }
}

async function readSeedPlayers() {
  try {
    const raw = JSON.parse(
      await readFile(new URL("../public/data/player-seed.json", import.meta.url), "utf8"),
    );
    const seen = new Set();
    return raw.map((item) => ({
      id: number(item.id),
      name: text(item.name),
      rating: number(item.overall),
      position: text(item.position),
      added: "",
      auctionable: false,
      image: "",
      club: text(item.club),
      nation: text(item.nation),
      program: text(item.program),
      stats: {
        pace: number(item.pace),
        shooting: number(item.shooting),
        passing: number(item.passing),
        dribbling: number(item.dribbling),
        defending: number(item.defending),
        physical: number(item.physical),
      },
    })).filter((item) => item.id && !seen.has(item.id) && seen.add(item.id));
  } catch {
    return [];
  }
}

async function safe(name, loader, fallback) {
  try {
    const value = await loader();
    console.log(`synced ${name}`);
    return value;
  } catch (error) {
    console.warn(`using previous ${name}:`, error.message);
    return fallback;
  }
}

async function main() {
  const previous = await readPrevious();
  const seedPlayers = await readSeedPlayers();
  const [reviews, codes, cards, playerRenders, iconRenders, shardPlayers, topPayload, midPayload, lowPayload, latestPlayers] = await Promise.all([
    safe("reviews", async () => list(await fetchJson(`${forumApi}/player-reviews-new?limit=120&offset=0`))
      .map(parseReview)
      .filter((review) => review.name !== "Unknown" && review.position !== "-"), previous.reviews ?? []),
    safe("codes", async () => list(await fetchJson(`${forumApi}/redeem-codes`)).map((item) => ({
      id: number(item.id),
      code: text(item.code),
      reward: text(item.reward),
      addedDate: text(item.added_date),
      active: number(item.is_active) === 1,
    })).filter((item) => item.code), previous.codes ?? []),
    safe("cards", async () => list(await fetchJson(`${forumApi}/official-cards-new?limit=80&offset=0`)).slice(0, 80).map((item) => ({
      id: number(item.id),
      title: text(item.title),
      image: text(item.image_url),
      animatedImage: text(item.animated_card),
      type: text(item.card_type),
    })).filter((item) => item.image), previous.cards ?? []),
    safe("player renders", async () => list(await fetchJson(`${forumApi}/player-renders?limit=60&offset=0`)).slice(0, 60).map((item) => ({
      id: number(item.id),
      name: text(item.playerName),
      image: text(item.playerRenders),
      primary: text(item.club),
      secondary: text(item.nationality),
    })).filter((item) => item.image), previous.playerRenders ?? []),
    safe("icon renders", async () => list(await fetchJson(`${forumApi}/icon-renders?limit=60&offset=0`)).slice(0, 60).map((item) => ({
      id: number(item.id),
      name: text(item.playerRenders),
      image: text(item.playerImage),
      primary: text(item.nation),
      secondary: "Icon",
    })).filter((item) => item.image), previous.iconRenders ?? []),
    safe("ShardIQ", async () => list(await fetchJson(`${forumApi}/shard-combo-calculator`)).map((item) => ({
      id: text(item.id),
      name: text(item.player_name),
      image: text(item.player_card),
      overall: number(item.ovr),
      position: text(item.position).toUpperCase(),
      shardValue: number(item.shard_value),
      event: text(item.event),
      quality: text(item.quality).toLowerCase(),
      alternatives: text(item.alternative_pos).split(",").map((value) => value.trim().toUpperCase()).filter(Boolean),
    })).filter((item) => item.id && item.position), previous.shardPlayers ?? []),
    safe("top rankings", () => fetchJson(`${forumApi}/top-10-cards?position=ST`), null),
    safe("mid rankings", () => fetchJson(`${forumApi}/top-5-mid-cards?position=ST`), null),
    safe("low rankings", () => fetchJson(`${forumApi}/top-5-low-cards?position=ST`), null),
    safe("latest players", fetchLatestPlayers, previous.latestPlayers?.length ? previous.latestPlayers : seedPlayers),
  ]);

  const rankings = Object.fromEntries(
    positions.map((position) => [
      position,
      {
        top: topPayload ? parseRankGroup(topPayload, position, 10) : previous.rankings?.[position]?.top ?? { updatedAt: "", cards: [] },
        mid: midPayload ? parseRankGroup(midPayload, position, 5) : previous.rankings?.[position]?.mid ?? { updatedAt: "", cards: [] },
        low: lowPayload ? parseRankGroup(lowPayload, position, 5) : previous.rankings?.[position]?.low ?? { updatedAt: "", cards: [] },
      },
    ]),
  );

  const data = {
    generatedAt: new Date().toISOString(),
    reviews,
    codes,
    cards,
    playerRenders,
    iconRenders,
    rankings,
    shardPlayers,
    latestPlayers,
  };

  await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data)}\n`);
  console.log(`wrote ${outputPath.pathname}`);
}

await main();
