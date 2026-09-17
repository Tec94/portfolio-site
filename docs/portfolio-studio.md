# Portfolio Studio

Run `npm run studio` from this repository. Open the local URL printed in the
terminal. The operating system chooses an available loopback port. To keep a
specific URL, set `STUDIO_PORT` to an available port of your choice before starting.
Keep the terminal running while you edit. Stop it with Ctrl+C.

## Everyday workflow

1. Open **Projects**, **Writing**, or **Site content** and select an entry.
   Choose **New project** to open a blank form. Enter a normal project name;
   Studio generates its URL automatically when you save. No slug is required.
2. Change its fields. Use Markdown for project process writing and articles.
   Images, links, headings, lists, and inline MDX are supported.
3. Choose **Save changes**, then **Preview** to see the saved portfolio.
4. Open **Publish**, optionally **Check build**, then **Publish saved changes**.
   The button publishes without an AI prompt or a Git commit.

Project types and technologies have selectable options, searchable lists, and
custom entries. You can add a prebuilt tech stack and then adjust its selected
technologies. Existing custom values remain available.

Drag a project's handle in the **Projects** list to change its order. Arrow
buttons and the handle's Up/Down keyboard controls do the same thing. Ordering
saves locally as soon as you move a project; publish to update the live site.

In a project's **Images & videos** section, drop several files or select them
together. Each file attaches directly to the project, with detected dimensions,
an editable description based on its filename, and an automatic thumbnail for
videos. Review descriptions for meaningful alt text. The first item is the cover;
use the arrows to change media order. Captions, poster replacements, and technical
settings are optional under **Caption & advanced settings**. Files the browser
cannot decode are reported individually; successfully added files are retained.
Choose **Save changes** to save the updated project. Removing an item keeps its
original in the library until separately removed.

Site content includes homepage copy, page text, profile, experience, education,
milestones, services, contact labels, links, and search/social metadata. Text
around inline links is presented as separate fields so existing link placement
is preserved. This manages the current portfolio; archived classic/v2 layouts,
application logic, and visual design remain code.

Local Studio preview includes draft article and case-study bodies. Normal
production routes continue to exclude draft article bodies and show the
portfolio's existing “case study in review” presentation for draft projects.
Project titles and cover media can therefore still appear publicly for draft
projects. Delete a project if you want it entirely removed from the public site.

## Media

Upload images, videos, or PDFs in **Media library**. Files are stored under
`public/assets/studio/` with content-derived names. Select them from project media,
article covers, process writing, or the résumé field. Keep meaningful alt text.

Publishing uploads Studio media to the configured Cloudflare R2 bucket. The Vite
production build replaces local Studio media paths with their public R2 URLs and
excludes their original files from the Pages bundle. Existing R2 assets remain
usable. Remote originals are not deleted when you remove a reference; unused
local uploads can be moved to local trash from the library.

## Saves and recovery

Saved content is stored in `src/content/projects`, `src/content/writing`, and
`src/content/site`. Saves update the existing files without creating commits.
They are visible to the usual portfolio development server as well.

Unsaved drafts are retained in this browser's local storage when available.
Reopening an entry offers to restore its unsaved draft if the underlying file
has not changed. They are not included in publishing.

**Show saved revisions** loads an earlier saved version into the editor. Choose
**Save changes** to restore it. Conflicting saves from another tab or code editor
are rejected rather than overwritten. Deleted entries and unused local media are
moved to `.studio/trash/`; copy a deleted entry back to its original
`src/content/...` path to recover it. Revision history lives in `.studio/history/`.

## Publishing and authentication

`studio.config.json` contains the Cloudflare Pages project, production branch,
media bucket, public media origin, and site URL. It contains no credentials.
Wrangler uses the existing local Cloudflare login. If it expires, run
`npx wrangler login` in a terminal and complete the browser sign-in.

Publishing freezes the saved checkout in `.studio/releases/`, validates its
content, builds it, uploads Studio media, deploys through Wrangler, and verifies
the resulting deployment URL with a release marker. Public Vite environment
variables are loaded from the repository for the build; local environment files
are not copied into snapshots. The public site has no Studio server or editor.

Publishing includes the current source code and all saved content, including
uncommitted changes. It does not commit or push Git. The existing Git-connected
Cloudflare deployment can still deploy a later push; keep the repository's saved
content committed and synchronized when you use that workflow. A plain build
does not upload new R2 media: use Studio Publish before deploying newly uploaded
media through another workflow.

Build failures stop the job before uploads or deployment. Upload failures stop
before Pages deployment. If a Pages deployment succeeds but verification fails,
the log and `.studio/last-publish.json` identify the deployment to inspect before
retrying. The editor disables saves and additional publishing jobs while a job
is running. The live domain may take additional time to reflect a verified
deployment.

## Verification

```sh
npm run test:studio
npx tsc -p studio/tsconfig.json
npm run type-check:portfolio
npm run lint:portfolio
npm test
npm run build
```

The local server binds to `127.0.0.1`, checks the Host and Origin, and requires a
per-session token for content APIs. Run it locally; do not expose it through a
public tunnel. Snapshots, revisions, and trash are private local state under
`.studio/`, which is excluded from Git.
