# Schema Viewer

> Open-source database schema visualizer. Forked from [ChartDB](https://github.com/chartdb/chartdb).
> Built by [payload.market](https://payload.market) — a marketplace for Payload CMS.

Import schemas from DBML, DDL, or SQL query results. Open any schema by URL with a single link. Deploy to GitHub Pages in one step. No installations, no database password required.

**Live Demo:**
[Blog](https://agafonovim.github.io/schema-viewer/#/?src=https://raw.githubusercontent.com/agafonovim/schema-viewer/main/public/examples/blog.dbml&format=dbml) |
[E-commerce · PostgreSQL](https://agafonovim.github.io/schema-viewer/#/?src=https://raw.githubusercontent.com/agafonovim/schema-viewer/main/public/examples/ecommerce.sql&format=ddl&db=postgresql) |
[SaaS · MySQL](https://agafonovim.github.io/schema-viewer/#/?src=https://raw.githubusercontent.com/agafonovim/schema-viewer/main/public/examples/saas.sql&format=ddl&db=mysql)

### Supported Databases

- PostgreSQL (+ Supabase, Timescale)
- MySQL
- SQL Server
- MariaDB
- SQLite (+ Cloudflare D1)
- CockroachDB
- ClickHouse

## Features (added in this fork)

- **GitHub Action** — deploy a pre-built schema viewer to your GitHub Pages in one step
- **URL import** — load a diagram from a remote URL via `?src=` query parameter
- **Static hosting support** — hash router and relative paths for GitHub Pages, Netlify, etc.

## GitHub Action

The action downloads a pre-built viewer into a directory. You control deploy in your own workflow.

> **Prerequisites:** Settings → Pages → Source → **Deploy from a branch** → `gh-pages`

### Minimal example

```yaml
name: Deploy Schema Viewer

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: agafonovim/schema-viewer@v1
        with:
          path: site

      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

After deployment, the viewer will be available at `https://<user>.github.io/<repo>/`.

### Deploy alongside your own files

```yaml
    steps:
      - uses: actions/checkout@v6

      - name: Prepare site
        run: |
          mkdir -p site
          cp -r schemas/ site/schemas/
          cp index.html site/index.html 2>/dev/null || true

      - uses: agafonovim/schema-viewer@v1
        with:
          path: site/viewer

      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
          keep_files: true
```

After deployment:
- Viewer: `https://<user>.github.io/<repo>/viewer/`
- Schema link: `https://<user>.github.io/<repo>/viewer/#/?src=https://<user>.github.io/<repo>/schemas/my-schema.sql&format=ddl&db=postgresql`

### Action inputs

| Input  | Description                                          | Required |
|--------|------------------------------------------------------|----------|
| `path` | Directory to extract the viewer into                 | yes      |

### PR preview with schema links

Deploy a per-PR preview and post clickable viewer links as a comment. Old previews are cleaned up automatically when the PR is closed.

See [pr-schema-preview.yaml](examples/workflows/pr-schema-preview.yaml) for the full workflow.

### Example workflows

See [examples/workflows/](examples/workflows/) for ready-to-use workflow files:

| Workflow | Description |
|----------|-------------|
| [deploy-viewer-only.yaml](examples/workflows/deploy-viewer-only.yaml) | Deploy just the viewer to GitHub Pages |
| [deploy-with-schemas.yaml](examples/workflows/deploy-with-schemas.yaml) | Deploy viewer alongside your schema files |
| [deploy-on-release.yaml](examples/workflows/deploy-on-release.yaml) | Deploy only on version tags |
| [pr-schema-preview.yaml](examples/workflows/pr-schema-preview.yaml) | Per-PR preview with viewer links in comments |
| [deploy-with-actions-pages.yaml](examples/workflows/deploy-with-actions-pages.yaml) | Deploy using `actions/deploy-pages` (Pages source: GitHub Actions) |

## URL Import

Load a diagram by passing a URL to a schema file via the `src` query parameter:

```
https://<user>.github.io/<repo>/#/?src=https://example.com/schema.json
```

### Query parameters

| Parameter | Description | Values | Default |
|-----------|-------------|--------|---------|
| `src` | URL to fetch the schema from | Any HTTP/HTTPS URL | |
| `format` | Import format of the file | `dbml`, `ddl`, `query` | auto-detect |
| `db` | Target database type (used with `ddl` or `query`) | `generic`, `postgresql`, `mysql`, `sql_server`, `mariadb`, `sqlite`, `clickhouse`, `cockroachdb`, `oracle` | `generic` |

### Examples

#### Open a file from this repository

Use `raw.githubusercontent.com` to link directly to schema files in public repositories:

```
https://agafonovim.github.io/schema-viewer/#/?src=https://raw.githubusercontent.com/agafonovim/schema-viewer/main/public/examples/blog.dbml&format=dbml
```

General pattern:

```
https://agafonovim.github.io/schema-viewer/#/?src=https://raw.githubusercontent.com/<user>/<repo>/<branch>/path/to/schema.dbml&format=dbml
```

#### Format examples

Import a DBML file:

```
#/?src=https://example.com/schema.dbml&format=dbml
```

Import a PostgreSQL DDL:

```
#/?src=https://example.com/schema.sql&format=ddl&db=postgresql
```

Import a query result (JSON):

```
#/?src=https://example.com/schema.json&format=query&db=mysql
```

## Upstream

This is a fork of [ChartDB](https://github.com/chartdb/chartdb). Upstream changes are synced daily via automated workflow.

## License

Licensed under the [GNU Affero General Public License v3.0](LICENSE).
