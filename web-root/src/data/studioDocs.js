export const studioDocGroups = [
  {
    title: 'Get started',
    articles: ['overview', 'quick-start', 'connect-wordpress-com'],
  },
  {
    title: 'Local sites',
    articles: ['studio-sites', 'ssl', 'import-export', 'debugging', 'xdebug'],
  },
  {
    title: 'Share and publish',
    articles: ['preview-sites', 'studio-sync'],
  },
  {
    title: 'Automation and AI',
    articles: ['studio-cli', 'studio-code', 'agent-skills', 'mcp', 'assistant'],
  },
  {
    title: 'Blueprints',
    articles: ['blueprints', 'open-in-studio-button', 'custom-blueprints'],
  },
  {
    title: 'Reference',
    articles: ['faq', 'changelog', 'roadmap', 'beta-features'],
  },
];

export const studioDocs = [
  {
    slug: 'overview',
    title: 'WordPress Studio',
    description: 'A free desktop app for local WordPress development.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/',
    updated: 'May 20, 2026',
    content: [
      section('what-studio-does', 'What Studio does', [
        p('WordPress Studio creates local WordPress sites on your computer without requiring you to install and maintain a separate PHP, database, or server stack. It is built for fast local development, previews, syncing, and agent-assisted workflows.'),
        ul([
          'Create unlimited local WordPress sites.',
          'Use SSL and custom local domains to better match production.',
          'Start sites from Blueprints so the same setup can be repeated.',
          'Manage sites from the desktop app, Studio CLI, or AI-assisted workflows.',
          'Use debugging tools such as the debug log, phpMyAdmin, and Xdebug.',
        ]),
      ]),
      section('connected-workflows', 'Connected workflows', [
        p('Connecting WordPress.com unlocks preview sites, two-way sync with supported WordPress.com and Pressable sites, and access to assistant features. Studio can pull an existing online site locally, push local work to staging or production, and publish temporary previews for review.'),
      ]),
      section('related-features', 'Related features', [
        ul([
          'Studio Sites: local WordPress instances listed in the app sidebar.',
          'Studio CLI: terminal access to site, preview, auth, WP-CLI, Blueprint, and agent workflows.',
          'Studio Code: an early-access AI coding agent for WordPress work.',
          'Blueprints: reusable site-starting recipes for plugins, themes, content, and configuration.',
        ]),
      ]),
    ],
  },
  {
    slug: 'quick-start',
    title: 'Quick start',
    description: 'Install Studio and create your first local site.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/',
    updated: 'May 20, 2026',
    content: [
      section('install-macos', 'Install on macOS', [
        ol([
          'Download the Studio installer for your Mac architecture.',
          'Open the downloaded file.',
          'Drag WordPress Studio into Applications.',
          'Open Studio and name your first site.',
        ]),
      ]),
      section('install-windows', 'Install on Windows', [
        ol([
          'Install Studio from the Microsoft Store or download the Windows installer.',
          'Launch Studio from the Start menu or wait for the installer to open it.',
          'Name your first site and continue into the app.',
        ]),
      ]),
      section('first-site', 'First site checklist', [
        ul([
          'Choose whether to build a new site, connect a site, or import from a backup.',
          'Use advanced settings only when you need a custom path, WordPress version, PHP version, domain, or SSL.',
          'Once the site starts, open WP Admin or the local site from the site overview.',
        ]),
      ]),
    ],
  },
  {
    slug: 'connect-wordpress-com',
    title: 'Connect WordPress.com',
    description: 'Enable previews, sync, and account-powered Studio features.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/',
    updated: 'May 20, 2026',
    content: [
      section('why-connect', 'Why connect', [
        p('A WordPress.com connection enables Preview Sites, Studio Sync, Assistant features, and future account-based improvements. You can create a free WordPress.com account if you do not already have one.'),
      ]),
      section('connect-steps', 'Connect from Studio', [
        ol([
          'Click the WordPress.com log in link in the top-right corner of Studio.',
          'Log in from the browser window that opens.',
          'Approve the authorization request.',
          'Return to Studio when prompted to finalize the connection.',
        ]),
        note('If Sync, Previews, or Assistant still show a login prompt after authorization, restart the desktop app.'),
      ]),
    ],
  },
  {
    slug: 'studio-sites',
    title: 'Studio sites',
    description: 'Create, start, stop, view, edit, and delete local WordPress sites.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/sites/',
    updated: 'May 19, 2026',
    content: [
      section('what-is-a-site', 'What is a Studio site', [
        p('A Studio site is a WordPress instance running locally on your computer. Each site appears in the Studio sidebar, and Studio supports unlimited local sites.'),
      ]),
      section('add-site', 'Add a new site', [
        ol([
          'Click Add site in the lower-left corner of Studio.',
          'Choose Build a new site, Connect a site, or Import from a backup.',
          'For a new site, select an empty site or a Blueprint.',
          'Optionally enable advanced settings for path, WordPress version, PHP version, custom domain, or SSL.',
          'Click Add site.',
        ]),
      ]),
      section('custom-domain', 'Custom domains and SSL', [
        p('New sites use localhost by default. You can enable a custom local domain when creating a site. Studio suggests a domain, or you can enter your own as long as it ends in .local. Studio can also enable HTTPS for that custom domain.'),
      ]),
      section('existing-directory', 'Use an existing WordPress directory', [
        ol([
          'Remove wp-config.php from the existing WordPress site directory, unless you plan to follow the advanced existing-config flow.',
          'Click Add site.',
          'Name the site, choose the existing path, and add it to Studio.',
        ]),
      ]),
      section('start-stop-view', 'Start, stop, and view sites', [
        ul([
          'A running site can be opened in your browser.',
          'A stopped site must be started before WP Admin or the local site can open.',
          'Use the Start or Running button in the site view, the status dot in the sidebar, or Stop all for all running local sites.',
          'WP Admin opens the dashboard and automatically logs you in.',
          'Open local site opens the site homepage.',
        ]),
      ]),
      section('overview-and-settings', 'Overview and settings', [
        p('The Overview tab gives one-click access to site editing areas. Block themes can show shortcuts for Site Editor, Styles, Patterns, Navigation, Templates, and Pages. Classic themes show available Customizer, Menus, and Widgets shortcuts.'),
        p('The Settings tab shows site name, local domain, local path, WordPress version, PHP version, WP Admin username, password, and admin URL. You can edit the site name and switch compatible PHP or WordPress versions.'),
      ]),
      section('open-in', 'Open in external tools', [
        ul([
          'File browsers: Finder on macOS and File Explorer on Windows.',
          'Code editors: Cursor, PhpStorm, Sublime Text, VS Code, WebStorm, Windsurf, and other detected editors.',
          'Terminals: Terminal, Warp, iTerm, Command Prompt, Ghostty, and other detected terminal apps.',
          'Database editor: phpMyAdmin.',
        ]),
      ]),
    ],
  },
  {
    slug: 'ssl',
    title: 'SSL in Studio',
    description: 'Use HTTPS with custom local domains.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/ssl-in-studio/',
    content: [
      section('local-https', 'Local HTTPS', [
        p('Studio can enable SSL for custom local domains so your local environment more closely matches production. This is useful when themes, plugins, browser APIs, or integrations expect HTTPS.'),
      ]),
      section('requirements', 'Requirements and behavior', [
        ul([
          'Custom domains must use the .local suffix.',
          'Studio may ask for your system password to point the custom domain to your local site and trust the certificate.',
          'If a browser warns about the certificate, review the SSL setup and trust prompts in Studio.',
        ]),
      ]),
    ],
  },
  {
    slug: 'import-export',
    title: 'Import and export',
    description: 'Move sites into and out of Studio with backup archives.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/import-export/',
    content: [
      section('import', 'Import a site', [
        p('Import lets you bring an existing WordPress site archive into Studio as a local site. It is useful for working from backups or moving work between environments.'),
        ol([
          'Choose Add site.',
          'Select Import from a backup.',
          'Pick the supported archive file.',
          'Name the site and let Studio create the local environment.',
        ]),
      ]),
      section('export', 'Export a site', [
        p('Export packages local work into an archive that can be stored, shared, or deployed elsewhere. Export is useful when Sync is not the right path or when you need a portable backup of local work.'),
      ]),
      section('import-export-notes', 'Notes', [
        ul([
          'Large sites can take longer to import or export.',
          'Hidden files and wp-content details matter when moving full site state.',
          'If import fails, check the archive format and source backup integrity.',
        ]),
      ]),
    ],
  },
  {
    slug: 'debugging',
    title: 'Debugging in Studio',
    description: 'Inspect logs, database state, and runtime issues.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/debugging/',
    content: [
      section('debug-tools', 'Debug tools', [
        p('Studio includes debugging tools so you can inspect local WordPress issues without installing extra services. Common tools include debug logs, application logs, phpMyAdmin, WP_DEBUG settings, and Xdebug.'),
      ]),
      section('where-to-start', 'Where to start', [
        ul([
          'Use the debug log when PHP errors, warnings, or notices appear.',
          'Use application logs when Studio itself or local services behave unexpectedly.',
          'Use phpMyAdmin to inspect database tables and local data.',
          'Use Xdebug for step debugging with a compatible editor.',
        ]),
      ]),
    ],
  },
  {
    slug: 'xdebug',
    title: 'Xdebug in Studio',
    description: 'Step debug WordPress code from your local Studio site.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/debugging/',
    content: [
      section('xdebug-purpose', 'What Xdebug is for', [
        p('Xdebug helps you pause PHP execution, inspect variables, and step through WordPress, plugin, or theme code while a Studio site runs locally.'),
      ]),
      section('editor-setup', 'Editor setup', [
        ul([
          'Enable Xdebug for the Studio site.',
          'Configure your editor to listen for PHP debugging connections.',
          'Set breakpoints in the plugin, theme, or WordPress file you want to inspect.',
          'Load the local site or WP Admin screen that runs the code path.',
        ]),
      ]),
      note('Use Xdebug only when you need interactive debugging. For quick diagnosis, the debug log is usually faster.'),
    ],
  },
  {
    slug: 'preview-sites',
    title: 'Preview Sites',
    description: 'Share temporary snapshots of local Studio sites.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/preview-sites/',
    updated: 'April 16, 2026',
    content: [
      section('what-previews-are', 'What Preview Sites are', [
        p('Preview Sites are temporary public snapshots of a local Studio site. They are powered by WordPress.com on a temporary wp.build domain and are intended for client review, teammate feedback, and short-term sharing.'),
        ul([
          'Each WordPress.com account can have up to ten preview sites at a time.',
          'Preview sites are for early feedback and expire after seven days from the last update.',
          'A hosting plan is required for a permanent public site.',
        ]),
      ]),
      section('create-preview', 'Create a preview', [
        ol([
          'Select the local site in Studio.',
          'Open the Previews tab.',
          'Log in to WordPress.com if needed.',
          'Click Create preview site.',
        ]),
      ]),
      section('manage-previews', 'Manage previews', [
        ul([
          'Rename a preview from the row action menu.',
          'Delete a preview from the row action menu.',
          'Update a preview to synchronize local changes and reset its expiration window.',
          'Delete all preview sites from the avatar preview-count menu.',
        ]),
      ]),
      section('deployignore', 'Exclude files with .deployignore', [
        p('When creating or updating a preview, Studio uploads wp-content. Add a .deployignore file at the site root to exclude build artifacts, vendor dependencies, logs, large media folders, or specific plugins. The syntax follows .gitignore-style patterns.'),
        code(`# Exclude vendor dependencies
wp-content/plugins/my-plugin/vendor

# Exclude log files
*.log

# Keep an important vendor package
!wp-content/plugins/my-plugin/vendor/important-lib`),
      ]),
    ],
  },
  {
    slug: 'studio-sync',
    title: 'Studio Sync',
    description: 'Pull from and push to supported hosted sites.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/sync/',
    content: [
      section('what-sync-does', 'What Sync does', [
        p('Studio Sync synchronizes a production or staging site with a local Studio site in either direction. Use it to pull an existing hosted site locally or push local work to a hosted environment.'),
      ]),
      section('compatible-sites', 'Compatible sites', [
        ul([
          'Paid WordPress.com sites are supported.',
          'Pressable sites are supported when Jetpack is enabled.',
          'Sync relies on Jetpack Backups for supported hosted sites.',
          'Studio supports syncing sites up to 5GB, or selected site portions under that limit.',
        ]),
      ]),
      section('sync-directions', 'Push and pull', [
        ul([
          'Pull copies a hosted site into a local Studio site.',
          'Push sends local changes to a connected WordPress.com or Pressable site.',
          'Review selected content before pushing or pulling, especially when database or uploads are involved.',
        ]),
      ]),
      note('Treat Sync like a deployment operation. Confirm the target site and selected content before overwriting hosted or local state.'),
    ],
  },
  {
    slug: 'studio-cli',
    title: 'Studio CLI',
    description: 'Use Studio from the terminal, scripts, CI, and AI agents.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/cli/',
    updated: 'May 20, 2026',
    content: [
      section('what-cli-does', 'What the CLI does', [
        p('Studio CLI is bundled with Studio and also available as the wp-studio npm package. It exposes Studio features from the terminal whether or not the desktop app is open.'),
        ul([
          'Manage local Studio sites.',
          'Create, update, list, and delete preview sites.',
          'Authenticate with WordPress.com.',
          'Run WP-CLI commands in the context of Studio-managed sites.',
          'Use Blueprints from scripts.',
          'Give AI coding agents a command surface for Studio work.',
        ]),
      ]),
      section('usage', 'Usage pattern', [
        code(`studio <area> <command> [options]
studio --help
studio <area> <command> --path /path/to/site`),
      ]),
      section('command-areas', 'Command areas', [
        table(['Area', 'Use'], [
          ['auth', 'Log in, log out, and check WordPress.com authentication.'],
          ['site', 'Create, list, start, stop, inspect, configure, or delete local sites.'],
          ['preview', 'Create, list, update, and delete preview sites.'],
          ['wp', 'Run WP-CLI without installing WP-CLI separately.'],
          ['blueprint', 'List and use Blueprints for repeatable site creation.'],
          ['code', 'Start the Studio Code AI agent.'],
        ]),
      ]),
      section('agents', 'Using the CLI with agents', [
        p('AI coding agents can run Studio commands, inspect output, and update code based on the results. Ask agents to use Studio CLI explicitly and set boundaries for destructive commands, database changes, and authentication flows.'),
      ]),
    ],
  },
  {
    slug: 'studio-code',
    title: 'Studio Code',
    description: 'An early-access AI coding agent for WordPress sites.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/studio-code/',
    updated: 'April 30, 2026',
    content: [
      section('what-studio-code-is', 'What Studio Code is', [
        p('Studio Code is an early-access AI-powered coding agent built into Studio CLI. It gives you an interactive terminal chat for building, customizing, and managing WordPress sites conversationally.'),
      ]),
      section('start-studio-code', 'Start Studio Code', [
        code(`npx wp-studio@latest code
npm i -g wp-studio@latest
studio code`),
      ]),
      section('login-and-providers', 'Login and AI providers', [
        ol([
          'Run studio code.',
          'Use /login to connect WordPress.com.',
          'Approve the browser authorization flow.',
          'Paste the token back into the terminal.',
        ]),
        p('By default, responses use WordPress.com infrastructure. You can also use your own Anthropic API key with /api-key and switch providers with /provider.'),
      ]),
      section('what-it-can-do', 'What it can do', [
        ul([
          'Create, start, stop, list, and delete local sites.',
          'Read, create, edit, and search theme and plugin files.',
          'Run WP-CLI commands.',
          'Validate generated block content.',
          'Take desktop and mobile screenshots.',
          'Run performance audits.',
          'Create, update, and delete Preview Sites.',
          'Push and pull with WordPress.com.',
          'Import and export site backups.',
        ]),
      ]),
      section('slash-commands', 'Slash commands', [
        table(['Command', 'Action'], [
          ['/browser', 'Open the active site in the browser.'],
          ['/login', 'Log in to WordPress.com.'],
          ['/logout', 'Log out.'],
          ['/api-key', 'Set or update an Anthropic API key.'],
          ['/model', 'Switch between supported models.'],
          ['/provider', 'Switch AI provider.'],
          ['/preview', 'Push the active site as a preview.'],
          ['/need-for-speed', 'Run a performance audit.'],
          ['/annotate', 'Open the visual inspector and annotate page elements.'],
          ['/exit', 'Exit the chat.'],
        ]),
      ]),
      section('sessions', 'Sessions', [
        code(`studio code sessions list
studio code sessions resume
studio code sessions resume latest
studio code sessions resume <id>
studio code sessions delete <id>
studio code --no-session-persistence`),
      ]),
    ],
  },
  {
    slug: 'agent-skills',
    title: 'Agent Skills in Studio',
    description: 'Install WordPress-specific guidance for AI coding agents.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/agent-skills-wordpress-studio/',
    updated: 'April 21, 2026',
    content: [
      section('what-skills-are', 'What Agent Skills are', [
        p('Agent Skills are SKILL.md files that tell an AI coding agent how to approach specific WordPress development work. Studio can install skills into sites so agents such as Claude Code or Cursor pick them up automatically.'),
      ]),
      section('available-skills', 'Built-in skills', [
        ul([
          'Studio CLI workflows.',
          'Plugin development.',
          'Block development.',
          'Block themes.',
          'REST API routes, endpoints, schema, and authentication.',
          'WP-CLI and operations.',
        ]),
      ]),
      section('where-stored', 'Where skills are stored', [
        p('Installed skills are copied into the site directory. For agents that use Claude-style layouts, Studio also creates a symlink under .claude/skills/<skill-id>.'),
      ]),
      section('manage-skills', 'Manage skills', [
        ul([
          'Install or remove skills globally from Settings -> Skills.',
          'Install all available skills at once.',
          'Apply global skill choices to existing and new sites.',
          'Manage per-site skills from the Edit site modal when a specific site needs different guidance.',
        ]),
      ]),
    ],
  },
  {
    slug: 'mcp',
    title: 'MCP in Studio',
    description: 'Give agents direct access to Studio tools.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/mcp-on-studio/',
    updated: 'April 21, 2026',
    content: [
      section('what-mcp-adds', 'What MCP adds', [
        p('Instruction files tell agents how to work. Studio MCP gives agents direct tools for creating, starting, stopping, and interacting with local WordPress sites.'),
      ]),
      section('configuration', 'Configuration', [
        p('Open Settings -> MCP in Studio and copy the JSON configuration into your agent MCP settings. The core command runs Studio as an MCP server.'),
        code(`{
  "wordpress-studio": {
    "command": "studio",
    "args": ["mcp"]
  }
}`),
      ]),
      section('what-agents-can-do', 'What connected agents can do', [
        ul([
          'Create and manage Studio sites.',
          'Run WP-CLI commands.',
          'Take screenshots.',
          'Use tools together with instruction files and installed skills.',
        ]),
      ]),
    ],
  },
  {
    slug: 'assistant',
    title: 'Studio Assistant',
    description: 'AI-powered development help inside Studio.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/assistant/',
    content: [
      section('assistant-purpose', 'Assistant purpose', [
        p('Studio Assistant helps with WordPress development tasks from inside the Studio app. It is connected to your selected site context and can help generate ideas, explain issues, and guide changes.'),
      ]),
      section('assistant-use', 'How to use it', [
        ul([
          'Connect WordPress.com to unlock Assistant features.',
          'Open the Assistant tab for the selected Studio site.',
          'Ask questions about site setup, development tasks, or troubleshooting.',
          'Review generated suggestions before applying changes to a site.',
        ]),
      ]),
    ],
  },
  {
    slug: 'blueprints',
    title: 'Blueprints',
    description: 'Create repeatable Studio site starting points.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/blueprints/',
    content: [
      section('what-blueprints-are', 'What Blueprints are', [
        p('Blueprints define repeatable site setup. They can specify plugins, themes, content, configuration, and setup steps so new Studio sites start from a known state.'),
      ]),
      section('using-blueprints', 'Using Blueprints', [
        ul([
          'Choose a Blueprint when creating a new Studio site.',
          'Use the Blueprints Gallery when available.',
          'Use Studio CLI blueprint commands for automation.',
          'Use custom Blueprints for team or project-specific starting points.',
        ]),
      ]),
    ],
  },
  {
    slug: 'open-in-studio-button',
    title: 'Open in WordPress Studio button',
    description: 'Launch Studio site creation from a Blueprint link.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/open-in-wordpress-studio-button/',
    content: [
      section('button-purpose', 'Button purpose', [
        p('The Open in WordPress Studio button lets a webpage or project link launch Studio with a Blueprint so users can create a local site from a prepared recipe.'),
      ]),
      section('good-uses', 'Good uses', [
        ul([
          'Let documentation readers open an example site locally.',
          'Share a starter project with a predefined plugin and theme setup.',
          'Publish team templates that create consistent local environments.',
        ]),
      ]),
    ],
  },
  {
    slug: 'custom-blueprints',
    title: 'Custom Blueprints',
    description: 'Build your own repeatable Studio setup recipes.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/create-custom-blueprints/',
    content: [
      section('custom-purpose', 'Why create custom Blueprints', [
        p('Custom Blueprints are useful when the same WordPress setup needs to be recreated across projects, contributors, or examples. They reduce manual setup and make local environments easier to reproduce.'),
      ]),
      section('custom-contents', 'What a custom Blueprint can include', [
        ul([
          'WordPress settings and setup steps.',
          'Plugin and theme installation.',
          'Content and configuration required for a project.',
          'Project-specific defaults that make a local site immediately useful.',
        ]),
      ]),
    ],
  },
  {
    slug: 'faq',
    title: 'Frequently asked questions',
    description: 'Common Studio questions and answers.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/frequently-asked-questions/',
    content: [
      section('common-questions', 'Common questions', [
        ul([
          'Studio is a local development app, not a hosting plan.',
          'Local sites live on your computer until you publish, sync, export, or share a preview.',
          'Preview Sites are temporary and intended for short-term sharing.',
          'Sync availability depends on the connected hosted site and plan support.',
          'Studio CLI and Studio Code are for users who want terminal and agent-assisted workflows.',
        ]),
      ]),
    ],
  },
  {
    slug: 'changelog',
    title: 'Changelog',
    description: 'Recent Studio releases, fixes, and improvements.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/changelog/',
    content: [
      section('release-pattern', 'Release pattern', [
        p('Studio ships frequently. The changelog highlights new features, fixes, dependency updates, CLI changes, Studio Code improvements, and platform-specific packaging updates.'),
      ]),
      section('recent-themes', 'Recent themes', [
        ul([
          'Blueprints Gallery and Blueprint workflow improvements.',
          'Studio CLI expansion and Linux CLI installation support.',
          'Studio Code remote sessions, slash commands, annotations, and reliability improvements.',
          'Push, pull, import, export, Preview Site, and .deployignore improvements.',
          'Debugging, phpMyAdmin, dark mode, editor support, and packaging fixes.',
        ]),
      ]),
      section('release-notes', 'Release notes', [
        p('Technical release notes remain available from the Studio repository for exact commits and issue-level changes.'),
      ]),
    ],
  },
  {
    slug: 'roadmap',
    title: 'Roadmap',
    description: 'Planned Studio direction and upcoming work.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/roadmap/',
    content: [
      section('roadmap-purpose', 'Roadmap purpose', [
        p('The roadmap communicates planned areas of investment for Studio. It is directional, and planned items can change as the product evolves.'),
      ]),
      section('how-to-read', 'How to read it', [
        ul([
          'Use roadmap items to understand where Studio is heading.',
          'Treat timing and scope as subject to change.',
          'Use the changelog for what has already shipped.',
          'Use GitHub issues for bug reports, feature requests, and contribution discussion.',
        ]),
      ]),
    ],
  },
  {
    slug: 'beta-features',
    title: 'Beta features',
    description: 'Try Studio features that are still evolving.',
    source: 'https://developer.wordpress.com/docs/developer-tools/studio/roadmap/',
    content: [
      section('what-beta-means', 'What beta means', [
        p('Beta features expose work that is still being tested and refined. They can change, move, or disappear as the product team learns from usage.'),
      ]),
      section('beta-guidance', 'Guidance', [
        ul([
          'Use beta features when you are comfortable with rough edges.',
          'Avoid relying on beta behavior for critical production workflows.',
          'Share feedback when a beta feature is confusing, broken, or valuable.',
        ]),
      ]),
    ],
  },
];

function section(id, title, children) {
  return { type: 'section', id, title, children };
}

function p(text) {
  return { type: 'p', text };
}

function ul(items) {
  return { type: 'ul', items };
}

function ol(items) {
  return { type: 'ol', items };
}

function code(text) {
  return { type: 'code', text };
}

function note(text) {
  return { type: 'note', text };
}

function table(headers, rows) {
  return { type: 'table', headers, rows };
}
