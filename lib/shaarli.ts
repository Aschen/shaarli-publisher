import * as Jws from "jws";

export type Link = {
  id: number;
  url: string;
  shorturl: string;
  title: string;
  description: string;
  tags: string[];
  private: boolean;
  created: string;
  updated: string;
};

function getToken({ secret }: { secret: string }) {
  const token = Jws.sign({
    header: {
      alg: "HS512",
      typ: "JWT",
    },
    payload: { iat: Math.floor(Date.now() / 1000) },
    secret,
  });

  return token;
}

export async function listLinks({
  url,
  secret,
  offset,
  limit,
  searchtags,
  date,
}: {
  secret: string;
  url: string;
  offset?: number;
  limit?: number;
  searchtags?: string;
  date?: Date;
}): Promise<Link[]> {
  const params = new URLSearchParams();

  if (offset !== undefined) params.append("offset", offset.toString());
  if (limit !== undefined) params.append("limit", limit.toString());
  if (searchtags) params.append("searchtags", searchtags);

  const route = `${url}/links?${params}`;
  console.log(route);
  const response = await fetch(route, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken({
        secret,
      })}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const links = await response.json();

  if (date) {
    return links.filter((link) => new Date(link.created) > date);
  }

  return links;
}

export async function tryCreateLink({
  secret,
  url,
  linkUrl,
  title,
  description,
  tags,
}: {
  url: string;
  secret: string;
  linkUrl: string;
  title: string;
  description: string;
  tags: string[];
}): Promise<any> {
  const response = await fetch(`${url}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken({ secret })}`,
    },
    body: JSON.stringify({
      url: linkUrl,
      title,
      description,
      tags,
      private: false,
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      return response.json();
    }

    throw new Error(`Error: ${response.status}: ${await response.text()}`);
  }

  return response.json();
}
