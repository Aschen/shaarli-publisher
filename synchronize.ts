import { listLinks, tryCreateLink } from "./lib/shaarli";

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }

  return value;
}

const tags = getEnv("TAGS")
  .split(",")
  .map((t) => t.trim());

const linksAi = await listLinks({
  url: getEnv("SHAARLI_SOURCE_URL"),
  secret: getEnv("SHAARLI_SOURCE_SECRET"),
  limit: 20,
  searchtags: tags.join(","),
});

for (const link of linksAi.reverse()) {
  await tryCreateLink({
    url: getEnv("SHAARLI_TARGET_URL"),
    secret: getEnv("SHAARLI_TARGET_SECRET"),
    linkUrl: link.url,
    title: link.title,
    description: link.description,
    tags: link.tags.filter((tag) => !tags.includes(tag)),
  });
}

console.log("Links synchronized");
