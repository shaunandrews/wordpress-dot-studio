import danceStudioPaintingUrl from '../../assets/painting-dance-studio.png?url';
import draftingPaintingUrl from '../../assets/painting-drafting-table.png?url';
import fashionPaintingUrl from '../../assets/painting-fashion-house.png?url';
import musicStudioPaintingUrl from '../../assets/painting-music-studio.png?url';
import photoShootPaintingUrl from '../../assets/painting-photo-shoot.png?url';
import studioApartmentPaintingUrl from '../../assets/painting-studio-apartment.png?url';
import tvStudioPaintingUrl from '../../assets/painting-tv-studio.png?url';
import workbenchPaintingUrl from '../../assets/painting-workbench.png?url';

export const heroCopy = {
  title: 'One place for the work around WordPress',
  body: 'Spin up local sites, share previews, sync hosted work, automate the boring parts, and hand bigger tasks to agents without rebuilding your workflow every time.',
  primaryAction: 'Download for macOS',
  installCommand: 'npm install -g wp-studio@latest',
};

// Shared art direction for use-case illustrations. A generator combines this
// with each use case's `graphicPrompt` to produce a cohesive set. Until real art
// exists, cards fall back to a deterministic FPO gradient (see UseCaseGridOverlay).
export const heroGraphicStyle =
  'Modern editorial spot illustration on a soft gradient ground — WordPress blue (#3858E9) cooling into a warm amber/terracotta accent; simple geometric forms with gentle depth and a faint paper grain; one clear focal subject, generous negative space, no text or logos; confident and friendly; 4:3.';

export const heroUseCases = [
  {
    id: 'local-site',
    label: 'Create local sites',
    title: 'Create local WordPress sites',
    body: 'Spin up a complete WordPress install on your machine in seconds — no Docker, no manual server setup. Choose the WordPress and PHP version, give it a custom .local domain, and Studio builds and runs the environment for you. Each site lands in the sidebar, ready to open in WP Admin or the browser in one click.',
    graphicPrompt:
      'A fresh WordPress site blooming out of an open laptop like a paper pop-up, a tidy site card rising on a beam of light from the screen.',
    start: 0,
    crownLane: -1,
  },
  {
    id: 'multi-site',
    label: 'Run several sites at once',
    title: 'Run unlimited sites side by side',
    body: 'Keep as many local sites running as you need and switch between them instantly. Compare a client build against a plugin sandbox, or keep separate projects warm at once — each site is isolated, with its own versions and settings, and starts or stops on its own.',
    graphicPrompt:
      'A calm row of small glowing site windows floating in parallel above a desk, one gently lifted forward as the active one.',
    start: 0.382,
    crownLane: 1,
  },
  {
    id: 'wp-admin',
    label: 'Jump into WP Admin',
    title: 'Jump into WP Admin',
    body: 'Open the WordPress dashboard for any local site in one click, already signed in — no username or password to type. Jump straight into configuring themes, plugins, menus, and content.',
    graphicPrompt:
      'A key turning into an open dashboard door, a friendly admin gauge cluster glowing just beyond it.',
    start: 0.764,
    crownLane: 0,
  },
  {
    id: 'open-browser',
    label: 'Open a site in your browser',
    title: 'Open a site in your browser',
    body: 'Launch the front end of a local site in your default browser straight from Studio, and click through it exactly the way a visitor would — no copying URLs or remembering ports.',
    graphicPrompt:
      'A browser window lifting off a laptop and unfolding into a small, sunlit web page.',
    start: 0.146,
    crownLane: -1,
  },
  {
    id: 'open-editor',
    label: 'Open the project code',
    title: 'Open the project in your editor',
    body: 'Jump from a site straight into the code. Studio opens the project folder in your editor of choice — VS Code, PhpStorm, Sublime — or a terminal, so theme and plugin files are always a click away.',
    graphicPrompt:
      'A folder opening to reveal neat stacks of code cards, a cursor arrow lifting one toward an editor panel.',
    start: 0.528,
    crownLane: 1,
  },
  {
    id: 'start-stop',
    label: 'Start and stop sites',
    title: 'Start and stop sites anytime',
    body: "Run a site only when you need it and stop it when you're done, so background services aren't humming while you work on something else. Every site has its own one-click toggle.",
    graphicPrompt:
      'A soft power toggle on a small site orb; most orbs at rest and dim, one lit and awake.',
    start: 0.91,
    crownLane: 0,
  },
  {
    id: 'php-version',
    label: 'Switch PHP versions',
    title: 'Switch PHP and WordPress versions',
    body: 'Run a site on a different PHP or WordPress version to see how a theme or plugin behaves before you change versions on a production host. Pick versions when you create a site, or switch them later.',
    graphicPrompt:
      'A version dial swapping interchangeable building-block layers beneath a small site, each layer a different shade.',
    start: 0.292,
    crownLane: -1,
  },
  {
    id: 'https',
    label: 'Develop over HTTPS',
    title: 'Develop over local HTTPS',
    body: 'Turn on real HTTPS for a local site with a custom .local domain. Studio runs its own certificate authority and issues trusted certificates, so you can catch SSL-only issues and test secure-context browser features long before launch.',
    graphicPrompt:
      'A small padlock clicking shut over a local site, a certificate ribbon and a shield with a soft secure glow.',
    start: 0.674,
    crownLane: 1,
  },
  {
    id: 'blueprint',
    label: 'Reuse a setup',
    title: 'Reuse a setup with Blueprints',
    body: "A Blueprint is a small recipe that defines exactly what a new site starts with — WordPress and PHP versions, plugins, themes, settings, starter content, even custom PHP or SQL steps. Begin from Studio's Quick Start, Development, or Commerce blueprints or write your own, then share it as an 'Open in Studio' link so anyone can spin up the identical environment locally.",
    graphicPrompt:
      'A blueprint scroll unrolling into a finished site, faint construction grid lines snapping plugins and themes into place.',
    start: 0.056,
    crownLane: 0,
  },
  {
    id: 'preview-link',
    label: 'Share a preview link',
    title: 'Share a preview link',
    body: 'Push your local work to a temporary preview site with a public wp.build URL, powered by WordPress.com — no hosting required. Send it to a client or teammate for feedback; links last seven days, you can run up to ten at once, and each refresh updates the preview and resets its timer.',
    graphicPrompt:
      'A local site lifting into a floating share bubble with a link tag, a paper plane carrying it toward two distant figures.',
    start: 0.438,
    crownLane: -1,
  },
  {
    id: 'sync-site',
    label: 'Push and pull hosted work',
    title: 'Push and pull hosted work',
    body: 'Connect a local site to WordPress.com or Pressable and sync in both directions — pull a live site down to work on it locally, or push files and database changes up to staging or production when you are ready. Studio takes a backup before each sync so you can roll back.',
    graphicPrompt:
      'Two arrows curving up to a cloud and back down to a laptop, a small safety-net backup floating beneath.',
    start: 0.82,
    crownLane: 1,
  },
  {
    id: 'import-site',
    label: 'Import from a backup',
    title: 'Import a site from a backup',
    body: 'Bring an existing site into Studio from an archive — .tar.gz, .zip, .sql, or .wpress — whether it came from WordPress.com, a Jetpack backup, the Local app, or Playground. Test its content, themes, and plugins locally before touching anything live.',
    graphicPrompt:
      'A packed archive box opening as a full site reconstitutes above it, pieces floating into a laptop.',
    start: 0.202,
    crownLane: 0,
  },
  {
    id: 'export-site',
    label: 'Export to deploy',
    title: 'Export a site to deploy',
    body: 'Package a local Studio site into a ready-to-deploy archive — a full-site .zip or a database-only .sql — to save it, hand it off, or restore it on a hosted WordPress site.',
    graphicPrompt:
      'A site neatly folding into a sealed shipping crate with a tidy export label, ready on a loading pad.',
    start: 0.584,
    crownLane: -1,
  },
  {
    id: 'wp-cli',
    label: 'Automate with the CLI',
    title: 'Automate with the Studio CLI',
    body: 'Drive Studio from the terminal: create, start, stop, and list sites, spin up preview sites, and run WP-CLI against any local site with no separate install. Perfect for scripting repetitive setup and letting AI coding agents invoke real commands.',
    graphicPrompt:
      'A terminal prompt sprouting small automated arms that assemble and start sites on their own.',
    start: 0.966,
    crownLane: 1,
  },
  {
    id: 'studio-code',
    label: 'Build with Studio Code',
    title: 'Build with Studio Code',
    body: 'Studio Code is an AI coding agent built into the CLI (early access). Describe what you want in plain language and it creates files, edits code, runs WP-CLI, captures screenshots, runs performance audits, and can publish to a preview or to production — you can even annotate elements on the page to direct design changes.',
    graphicPrompt:
      'A friendly cursor-robot painting a theme directly onto a live site, annotation pins dotted around the canvas.',
    start: 0.348,
    crownLane: 0,
  },
  {
    id: 'assistant',
    label: 'Ask the Assistant',
    title: 'Ask the Studio Assistant',
    body: "A built-in AI chat that understands your site's installed themes and plugins, so its answers fit your actual setup. Ask WordPress questions, generate blocks and code snippets, or run WP-CLI right from the conversation — 200 prompts a month with a WordPress.com connection.",
    graphicPrompt:
      'A speech bubble built from WordPress blocks hovering beside a site, a small guiding spark inside it.',
    start: 0.73,
    crownLane: -1,
  },
  {
    id: 'agent-skills',
    label: 'Give agents skills',
    title: 'Give agents WordPress skills',
    body: 'Studio bundles Agent Skills — focused knowledge files covering plugin development, block creation, REST APIs, and CLI workflows — that coding agents like Claude Code pick up automatically, so the code they generate follows WordPress standards without you spelling out every detail.',
    graphicPrompt:
      "A stack of glowing skill cards slotting into a robot's open chest panel, each card a WordPress motif.",
    start: 0.112,
    crownLane: 1,
  },
  {
    id: 'mcp',
    label: 'Drive Studio over MCP',
    title: 'Let agents drive Studio over MCP',
    body: "Studio exposes a Model Context Protocol server, so AI clients like Claude Desktop, Cursor, and VS Code can create, start, stop, and operate your local sites, run WP-CLI, and capture screenshots. Copy the JSON config from Studio's settings and your agent has real hands on the environment.",
    graphicPrompt:
      'A tidy socket connecting an agent panel to a local site, clean data conduits lighting up between them.',
    start: 0.494,
    crownLane: 0,
  },
  {
    id: 'debug-logs',
    label: 'Debug PHP errors',
    title: 'Debug PHP errors',
    body: "Flip on debugging and Studio configures WP_DEBUG and WP_DEBUG_LOG for you, capturing PHP errors to wp-content/debug.log with an 'Open log file' link — or show errors inline in the browser. Point an AI agent at the log for automated analysis and fixes.",
    graphicPrompt:
      'A magnifying glass over a log scroll, a small red error bug caught and highlighted in the lens.',
    start: 0.876,
    crownLane: -1,
  },
  {
    id: 'database',
    label: 'Inspect the database',
    title: 'Inspect the database',
    body: 'Open phpMyAdmin for any local site straight from the Overview tab — run queries, verify content changes, and check exactly what a plugin wrote, with no separate database tool to install.',
    graphicPrompt:
      'A tidy stack of glowing database cylinders with a magnifier peeking into one row.',
    start: 0.258,
    crownLane: 1,
  },
  {
    id: 'xdebug',
    label: 'Step through PHP',
    title: 'Step through PHP with Xdebug',
    body: 'Enable Xdebug on a site, connect VS Code or PhpStorm, and set breakpoints in your plugin or theme. Loading the page pauses execution so you can inspect variables and step through the logic instead of guessing from logs.',
    graphicPrompt:
      'A paused play-head on a line of code with a breakpoint dot, variable values surfacing in floating chips.',
    start: 0.64,
    crownLane: 0,
  },
];

export const paintingOptions = [
  { id: 'drafting', label: 'Drafting', tooltip: 'A design studio', src: draftingPaintingUrl },
  { id: 'fashion', label: 'Fashion house', tooltip: 'A fashion studio', src: fashionPaintingUrl },
  {
    id: 'music-studio',
    label: 'Music studio',
    tooltip: 'A music studio',
    src: musicStudioPaintingUrl,
  },
  {
    id: 'dance-studio',
    label: 'Dance studio',
    tooltip: 'A dance studio',
    src: danceStudioPaintingUrl,
  },
  {
    id: 'photo-shoot',
    label: 'Photo shoot',
    tooltip: 'A photo studio',
    src: photoShootPaintingUrl,
  },
  {
    id: 'studio-apartment',
    label: 'Studio apartment',
    tooltip: 'A home studio',
    src: studioApartmentPaintingUrl,
  },
  { id: 'tv-studio', label: 'TV studio', tooltip: 'A TV studio', src: tvStudioPaintingUrl },
  { id: 'workbench', label: 'Workbench', tooltip: "A maker's studio", src: workbenchPaintingUrl },
];
