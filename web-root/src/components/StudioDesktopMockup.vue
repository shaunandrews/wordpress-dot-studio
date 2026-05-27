<!--
@component StudioDesktopMockup
@description Recreates the WordPress Studio desktop interface for the homepage hero with CSS-driven startup animation.
@notes Kept as semantic HTML/CSS instead of a flat image so future hero states can be animated or wired to props.
-->
<template>
  <figure class="studio-desktop" aria-label="WordPress Studio desktop interface preview">
    <div class="studio-window">
      <div class="studio-titlebar">
        <div class="studio-traffic" aria-hidden="true">
          <span class="traffic traffic-close"></span>
          <span class="traffic traffic-minimize"></span>
          <span class="traffic traffic-zoom"></span>
        </div>
        <div class="studio-window-actions" aria-hidden="true">
          <svg class="wp-icon" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg class="wp-icon" viewBox="0 0 24 24">
            <path d="M12 4a8 8 0 1 1 .001 16.001A8 8 0 0 1 12 4Zm0 1.5a6.5 6.5 0 1 0-.001 13.001A6.5 6.5 0 0 0 12 5.5Zm.75 11h-1.5V15h1.5v1.5Zm-.445-9.234a3 3 0 0 1 .445 5.89V14h-1.5v-1.25c0-.57.452-.958.917-1.01A1.5 1.5 0 0 0 12 8.75a1.5 1.5 0 0 0-1.5 1.5H9a3 3 0 0 1 3.305-2.984Z" />
          </svg>
        </div>
      </div>

      <div class="studio-shell">
        <aside class="studio-sidebar">
          <nav class="site-list" aria-label="Sites">
            <div class="site-item is-selected">
              <span>My WordPress Website</span>
              <span class="site-status status-starting"></span>
            </div>
            <div class="site-item">
              <span>Shaun Andrews</span>
              <span class="site-status status-running"></span>
            </div>
          </nav>

          <div class="sidebar-footer">
            <div class="running-row">
              <span>2 sites running</span>
              <span>Stop all</span>
            </div>
            <button class="add-site" type="button">Add site</button>
          </div>
        </aside>

        <main class="studio-content">
          <header class="content-header">
            <div>
              <h2>My WordPress Website</h2>
              <div class="quick-links">
                <span>WP admin ↗</span>
                <span>Open local site ↗</span>
              </div>
            </div>
            <div class="header-actions">
              <button class="publish-button" type="button">
                <svg class="wp-icon" viewBox="0 0 24 24">
                  <path d="M17.3 10.1c0-2.5-2.1-4.4-4.8-4.4-2.2 0-4.1 1.4-4.6 3.3h-.2C5.7 9 4 10.7 4 12.8c0 2.1 1.7 3.8 3.7 3.8h9c1.8 0 3.2-1.5 3.2-3.3.1-1.6-1.1-2.9-2.6-3.2zm-.5 5.1h-9c-1.2 0-2.2-1.1-2.2-2.3s1-2.4 2.2-2.4h1.3l.3-1.1c.4-1.3 1.7-2.2 3.2-2.2 1.8 0 3.3 1.3 3.3 2.9v1.3l1.3.2c.8.1 1.4.9 1.4 1.8-.1 1-.9 1.8-1.8 1.8z" />
                </svg>
                Publish site
              </button>
              <button class="running-button" type="button">
                <span class="starting-label">Starting...</span>
                <span class="running-state">
                  <span class="running-dot"></span>
                  <span>Running</span>
                </span>
              </button>
            </div>
          </header>

          <div class="tabbar">
            <span class="is-active">Overview</span>
            <span>Sync</span>
            <span>Previews</span>
            <span>Import / Export</span>
            <span>Settings</span>
            <span class="assistant-tab">
              <svg class="assistant-icon" width="14" height="14" viewBox="0 0 14 14">
                <path d="M13.7035 6.58213L10.8309 5.59124C9.69491 5.20089 8.79911 4.30509 8.40876 3.16908L7.41787 0.296515C7.28275 -0.0988382 6.71725 -0.0988382 6.58213 0.296515L5.59124 3.16908C5.20089 4.30509 4.30509 5.20089 3.16908 5.59124L0.296515 6.58213C-0.0988382 6.71725 -0.0988382 7.28275 0.296515 7.41787L3.16908 8.40876C4.30509 8.79911 5.20089 9.69491 5.59124 10.8309L6.58213 13.7035C6.71725 14.0988 7.28275 14.0988 7.41787 13.7035L8.40876 10.8309C8.79911 9.69491 9.69491 8.79911 10.8309 8.40876L13.7035 7.41787C14.0988 7.28275 14.0988 6.71725 13.7035 6.58213ZM10.3505 7.21269L8.91421 7.70813C8.3437 7.90331 7.8983 8.35371 7.70313 8.91921L7.20768 10.3555C7.13762 10.5557 6.85737 10.5557 6.79231 10.3555L6.29687 8.91921C6.1017 8.3487 5.6513 7.90331 5.08579 7.70813L3.64951 7.21269C3.44933 7.14263 3.44933 6.86238 3.64951 6.79232L5.08579 6.29687C5.6563 6.1017 6.1017 5.6513 6.29687 5.08579L6.79231 3.64951C6.86238 3.44933 7.14263 3.44933 7.20768 3.64951L7.70313 5.08579C7.8983 5.6563 8.3487 6.1017 8.91421 6.29687L10.3505 6.79232C10.5507 6.86238 10.5507 7.14263 10.3505 7.21269Z" />
              </svg>
              Assistant
            </span>
          </div>

          <section class="overview-panel">
            <div class="theme-panel">
              <h3>Theme</h3>
              <div class="theme-thumb" aria-hidden="true">
                <div class="theme-topline">
                  <span>My WordPress Website</span>
                  <span>Sample Page</span>
                </div>
                <div class="theme-title">Blog</div>
                <div class="post-preview">
                  <strong>Hello world!</strong>
                  <span>Welcome to WordPress. This is your first post.</span>
                </div>
                <div class="theme-footer">
                  <strong>My WordPress Website</strong>
                  <span>Blog<br />About<br />FAQs</span>
                  <span>Events<br />Shop<br />Themes</span>
                </div>
              </div>
              <p>Twenty Twenty-Five</p>
            </div>

            <div class="shortcut-panel">
              <div>
                <h3>Customize</h3>
                <div class="button-grid">
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M20.5 16h-.7V8c0-1.1-.9-2-2-2H6.2c-1.1 0-2 .9-2 2v8h-.7c-.8 0-1.5.7-1.5 1.5h20c0-.8-.7-1.5-1.5-1.5zM5.7 8c0-.3.2-.5.5-.5h11.6c.3 0 .5.2.5.5v7.6H5.7V8z" /></svg>Site Editor</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 0 1-6.5 6.5v-13a6.5 6.5 0 0 1 6.5 6.5Z" /></svg>Styles</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-17.6 1L10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5L9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z" /></svg>Patterns</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 5.5 12 5.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zM9 16l4.5-3L15 8.4l-4.5 3L9 16z" /></svg>Navigation</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M18 5.5H6a.5.5 0 00-.5.5v3h13V6a.5.5 0 00-.5-.5zm.5 5H10v8h8a.5.5 0 00.5-.5v-7.5zm-10 0h-3V18a.5.5 0 00.5.5h2.5v-8zM6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>Templates</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M15.5 7.5h-7V9h7V7.5Zm-7 3.5h7v1.5h-7V11Zm7 3.5h-7V16h7v-1.5Z" /><path d="M17 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM7 5.5h10a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5Z" /></svg>Pages</button>
                </div>
              </div>

              <div>
                <h3>Open in...</h3>
                <div class="button-grid open-grid">
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.934 7.406a1 1 0 0 0 .914.594H19a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5h5.764a.5.5 0 0 1 .447.276l.723 1.63Zm1.064-1.216a.5.5 0 0 0 .462.31H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.764a2 2 0 0 1 1.789 1.106l.445 1.084ZM8.5 10.5h7V12h-7v-1.5Zm7 3.5h-7v1.5h7V14Z" /></svg>Finder</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M20.8 10.7l-4.3-4.3-1.1 1.1 4.3 4.3c.1.1.1.3 0 .4l-4.3 4.3 1.1 1.1 4.3-4.3c.7-.8.7-1.9 0-2.6zM4.2 11.8l4.3-4.3-1-1-4.3 4.3c-.7.7-.7 1.8 0 2.5l4.3 4.3 1.1-1.1-4.3-4.3c-.2-.1-.2-.3-.1-.4z" /></svg>Cursor</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v12zM7 16.5h6V15H7v1.5zm4-4h6V11h-6v1.5zM9 11H7v1.5h2V11zm6 5.5h2V15h-2v1.5z" /></svg>Terminal</button>
                  <button type="button"><svg class="wp-icon" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="m3 5c0-1.10457.89543-2 2-2h13.5c1.1046 0 2 .89543 2 2v13.5c0 1.1046-.8954 2-2 2h-13.5c-1.10457 0-2-.8954-2-2zm2-.5h6v6.5h-6.5v-6c0-.27614.22386-.5.5-.5zm-.5 8v6c0 .2761.22386.5.5.5h6v-6.5zm8 0v6.5h6c.2761 0 .5-.2239.5-.5v-6zm0-8v6.5h6.5v-6c0-.27614-.2239-.5-.5-.5z" /></svg>phpMyAdmin</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.studio-desktop {
  --studio-black: #1d1d1d;
  --studio-sidebar: #202020;
  --studio-surface: #fbfbfb;
  --studio-border: #d8d8d8;
  --studio-text: #242424;
  --studio-muted: #777;
  --studio-blue: #3858e9;
  --studio-green: #00a32a;
  flex: 1;
  align-self: stretch;
  min-width: 0;
  min-height: 440px;
  margin: 0;
  color: var(--studio-text);
  font-family: var(--font-body);
  container-type: inline-size;
}

.studio-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  border: 1px solid color-mix(in srgb, var(--color-chrome-border) 72%, transparent);
  border-radius: 10px;
  background: var(--studio-black);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
  overflow: hidden;
}

.studio-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 18px;
  background: var(--studio-black);
}

.studio-traffic,
.studio-window-actions,
.header-actions,
.quick-links,
.running-row,
.site-item {
  display: flex;
  align-items: center;
}

.studio-traffic {
  gap: 8px;
}

.traffic {
  width: 11px;
  height: 11px;
  border-radius: 999px;
}

.traffic-close {
  background: #ff5f57;
}

.traffic-minimize {
  background: #ffbd2e;
}

.traffic-zoom {
  background: #28c840;
}

.studio-window-actions {
  gap: 18px;
  color: #f3f3f3;
}

.wp-icon,
.assistant-icon {
  display: block;
  flex: 0 0 auto;
  fill: currentColor;
}

.wp-icon {
  width: 18px;
  height: 18px;
}

.studio-window-actions .wp-icon {
  width: 20px;
  height: 20px;
}

.studio-shell {
  display: grid;
  grid-template-columns: 176px minmax(0, 1fr);
  column-gap: 12px;
  flex: 1;
  min-height: 0;
  padding: 0 12px 12px 0;
  background: var(--studio-black);
}

.studio-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  background: var(--studio-sidebar);
  color: #f2f2f2;
}

.site-list {
  display: grid;
  gap: 4px;
  padding: 10px 16px;
}

.site-item {
  justify-content: space-between;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.site-item span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-item.is-selected {
  background: rgba(255, 255, 255, 0.11);
}

.site-status,
.running-dot {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  border-radius: 999px;
}

.status-running,
.running-dot {
  background: #1ed15a;
}

.status-starting {
  border: 2px solid rgba(56, 88, 233, 0.22);
  border-top-color: var(--studio-blue);
  background: transparent;
  animation: start-site 5.4s ease-out infinite;
}

.sidebar-footer {
  display: grid;
  gap: 18px;
  padding: 18px 6px 8px 16px;
  position: relative;
}

.sidebar-footer::before {
  content: '';
  position: absolute;
  top: 0;
  right: -12px;
  left: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.running-row {
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
}

.add-site {
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  color: #f7f7f7;
  background: transparent;
  font: inherit;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
}

.studio-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--studio-surface);
  border-radius: 6px;
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 36px 32px 24px;
}

.content-header h2 {
  margin: 0;
  font-size: clamp(20px, 2.4cqw, 30px);
  line-height: var(--line-height-snug);
  font-weight: var(--font-weight-semibold);
}

.quick-links {
  gap: 18px;
  margin-top: 8px;
  color: var(--studio-muted);
  font-size: clamp(11px, 1.45cqw, 15px);
  font-weight: var(--font-weight-regular);
}

.header-actions {
  gap: 8px;
  align-self: flex-start;
}

.button-grid button {
  font-family: inherit;
}

.publish-button,
.running-button {
  height: 32px;
  border-radius: 2px;
  font-family: inherit;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  line-height: 1;
  white-space: nowrap;
}

.publish-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--studio-blue);
  background: var(--studio-blue);
  color: #f8f9ff;
  padding: 0 10px;
}

.running-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--studio-border);
  background: transparent;
  color: #078a25;
  padding: 0 9px;
}

.publish-button .wp-icon {
  width: 14px;
  height: 14px;
}

.running-state {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  animation: running-state 5.4s steps(1, end) infinite;
}

.starting-label {
  color: var(--studio-text);
  animation: starting-label 5.4s steps(1, end) infinite;
}

.tabbar {
  display: flex;
  align-items: end;
  gap: clamp(16px, 2.6cqw, 32px);
  min-height: 38px;
  padding: 0 32px;
  border-bottom: 1px solid var(--studio-border);
  color: var(--studio-text);
  font-size: clamp(10px, 1.3cqw, 13px);
  font-weight: var(--font-weight-regular);
  white-space: nowrap;
}

.tabbar span {
  display: flex;
  align-items: center;
  height: 100%;
}

.tabbar .is-active {
  border-bottom: 2px solid #111;
}

.assistant-tab {
  gap: 7px;
  margin-left: auto;
}

.overview-panel {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 32px;
  padding: 28px 32px;
}

.overview-panel h3 {
  margin: 0 0 14px;
  font-size: clamp(12px, 1.35cqw, 15px);
  line-height: var(--line-height-snug);
  font-weight: var(--font-weight-semibold);
}

.theme-thumb {
  display: flex;
  flex-direction: column;
  min-height: 236px;
  padding: 10px;
  border: 1px solid var(--studio-border);
  background: #fff;
  font-size: 4px;
  color: #1f1f1f;
}

.theme-topline,
.theme-footer {
  display: flex;
  justify-content: space-between;
}

.theme-title {
  margin-top: 34px;
  text-align: center;
  font-size: 10px;
}

.post-preview {
  display: grid;
  gap: 3px;
  margin: 28px auto 0;
  width: 42%;
}

.theme-footer {
  align-items: start;
  margin-top: auto;
  padding: 0 2px 28px;
}

.theme-panel p {
  margin: 10px 0 0;
  font-size: clamp(10px, 1.1cqw, 13px);
}

.shortcut-panel {
  display: grid;
  align-content: start;
  gap: 34px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(116px, 1fr));
  gap: 12px;
}

.button-grid button {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--studio-border);
  border-radius: 2px;
  background: transparent;
  color: var(--studio-text);
  font-size: clamp(11px, 1.35cqw, 14px);
  font-weight: var(--font-weight-regular);
  text-align: left;
  white-space: nowrap;
}

@keyframes start-site {
  0%,
  15% {
    transform: rotate(0deg);
    border-color: rgba(56, 88, 233, 0.22);
    border-top-color: var(--studio-blue);
    background: transparent;
  }
  55% {
    transform: rotate(720deg);
    border-color: rgba(56, 88, 233, 0.22);
    border-top-color: var(--studio-blue);
    background: transparent;
  }
  66%,
  100% {
    transform: rotate(720deg);
    border-color: #1ed15a;
    background: #1ed15a;
  }
}

@keyframes starting-label {
  0%,
  64% {
    display: inline;
    opacity: 1;
  }
  65%,
  100% {
    display: none;
    opacity: 0;
  }
}

@keyframes running-state {
  0%,
  64% {
    display: none;
    opacity: 0;
  }
  65%,
  100% {
    display: inline-flex;
    opacity: 1;
  }
}

@container (max-width: 760px) {
  .studio-shell {
    grid-template-columns: 138px minmax(0, 1fr);
  }

  .content-header {
    padding: 24px 24px 18px;
  }

  .header-actions {
    display: none;
  }

  .tabbar {
    gap: 18px;
    padding: 0 24px;
    overflow: hidden;
  }

  .tabbar span:nth-child(4),
  .tabbar span:nth-child(5),
  .assistant-tab {
    display: none;
  }

  .overview-panel {
    grid-template-columns: 160px minmax(0, 1fr);
    gap: 24px;
    padding: 24px;
  }

  .theme-thumb {
    min-height: 190px;
  }

  .button-grid {
    grid-template-columns: repeat(2, minmax(98px, 1fr));
  }

  .button-grid button {
    height: 34px;
  }
}

@container (max-width: 560px) {
  .studio-shell {
    grid-template-columns: 104px minmax(0, 1fr);
  }

  .site-list {
    padding-inline: 10px;
  }

  .site-item {
    font-size: 9px;
  }

  .sidebar-footer {
    padding-inline: 10px;
  }

  .running-row,
  .add-site {
    font-size: 9px;
  }

  .quick-links span:nth-child(2),
  .theme-panel,
  .button-grid button:nth-child(n + 5) {
    display: none;
  }

  .overview-panel {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-starting,
  .starting-label,
  .running-state {
    animation: none;
  }

  .status-starting {
    border-color: #1ed15a;
    background: #1ed15a;
  }

  .starting-label {
    display: none;
  }

  .running-state {
    display: inline-flex;
    opacity: 1;
  }
}
</style>
