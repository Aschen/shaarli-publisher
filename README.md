# Shaarli Synchronizer

This script allows to synchronize links from a Shaarli instance to another.

Just set the following env variables:

- `SHAARLI_SOURCE_URL`: Link of the source API (e.g. `https://links.aschen.tech/api/v1`)
- `SHAARLI_SOURCE_SECRET`: Source API secret
- `SHAARLI_TARGET_URL`: Link of the target API
- `SHAARLI_TARGET_SECRET`: Target API secret
- `TAGS`: List of tags to synchronize, separated by commas (e.g. `c-ai,troll`)

It can just run in a Github Action as a CRON: [.github/workflows/synchronize.yml](.github/workflows/synchronize.yml)
