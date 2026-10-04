# Portfolio Studio

Run `npm run studio` from this repository. Open the local URL printed in the
terminal. The operating system chooses an available loopback port. To keep a
specific URL, set `STUDIO_PORT` to an available port of your choice before starting.
Keep the terminal running while you edit. Stop it with Ctrl+C.

## Everyday workflow

1. Pick **Projects**, **Writing**, or **Site content**, then an entry in the
   list beside it. Every entry has its own URL (`#/projects/credify`), so
   reload, Back, and bookmarks work. **+ New** opens a blank form; the page URL
   is created from the title on first save.
2. Edit. Forms are split into collapsible sections. **Ctrl K** (or `/`)
   searches every title, sentence, and field across all content and jumps
   straight to the match with it selected — the fastest way to make a small
   copy edit.
3. **Ctrl S** saves. Unsaved edits are kept in this browser (an amber dot marks
   them in the sidebar and list) until you save or discard them.
4. Open **Publish**, optionally **Check build**, then **Publish saved changes**.
   The button publishes without an AI prompt or a Git commit.

**Panel** in the editor header opens a side panel:
- **Outline**: jump to any section or body heading, plus a publish checklist
  (what the current page type still needs).
- **Preview**: the saved page, live, at desktop or mobile width.
- **History**: earlier saves with the fields each one differs in; **Load** puts
  one in the editor.

Lists (highlights, experiences, links, services, media) reorder by dragging
the ⠿ handle or with the arrow buttons; items can be duplicated, collapsed,
or removed. Removing or reordering shows **Undo**, and **Ctrl Z** outside a
text field undoes the last structural change. In a list of short text rows,
Enter adds a row, Backspace on an empty row removes it, and Alt+↑/↓ moves it.

Project types, technologies, and article tags are token inputs: type and
press Enter, click a suggestion, or add a prebuilt stack. Drag tokens to
reorder them.

Choose **Reorder** in the **Projects** list to drag projects into a new order
(or focus a handle and use ↑/↓). Each move saves locally right away and offers
Undo; publish to update the live site.

In a project's **Images & videos** section, drop several files or select them
together. Each file attaches directly to the project, with detected dimensions,
an editable description based on its filename, and an automatic thumbnail for
videos. Review descriptions for meaningful alt text. The first item is the cover;
use the arrows to change media order. Captions, poster replacements, and technical
settings are optional under **More settings**. Files the browser
cannot decode are reported individually; successfully added files are retained.
Choose **Save** to save the updated project. Removing an item keeps its
original in the library until separately removed.

Site content includes homepage copy, page text, profile, experience, education,
milestones, services, contact labels, links, and search/social metadata. Text
around inline links is presented as separate fields so existing link placement
is preserved. This manages the current portfolio; archived classic/v2 layouts,
application logic, and visual design remain code.

To add a margin note to an article, put an `<aside>` immediately before the
paragraph, code block, or image it annotates. An optional `<small>` label numbers
it. On wide screens the note sits in a left column beside that block; on narrow
screens it appears above it.

```mdx
<aside><small>01</small>Dallas 311 export, about 40k rows after dedupe.</aside>

The paragraph the note is about.
```

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

**Panel → History** loads an earlier saved version into the editor. Choose
**Save** to restore it. Conflicting saves from another tab or code editor
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
