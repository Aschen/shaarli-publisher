# Shaarli Publisher Tools

## Synchronize two Shaarli instances

This script allows to synchronize links from a Shaarli instance to another.

Usefull to re-share some links in more specialized Shaarli instances.

Run `bun synchronize.ts`

Just set the following env variables:

- `SHAARLI_SOURCE_URL`: Link of the source API (e.g. `https://links.aschen.tech/api/v1`)
- `SHAARLI_SOURCE_SECRET`: Source API secret
- `SHAARLI_TARGET_URL`: Link of the target API
- `SHAARLI_TARGET_SECRET`: Target API secret
- `TAGS`: List of tags to synchronize, separated by commas (e.g. `c-ai,troll`)

It can just run in a Github Action as a CRON: [.github/workflows/synchronize.yml](.github/workflows/synchronize.yml)

## Create an HTML digest for a newsletter

This script generate HTML from links published on a Shaarli instance during the last week.

The script cannot be used as-is, it was designed for the https://genaifr.substack.com newsletter.
