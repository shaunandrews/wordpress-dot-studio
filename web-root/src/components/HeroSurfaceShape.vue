<!--
@component HeroSurfaceShape
@description The soft, animated misty horizon that fades a hero painting into the
page background. Mirrors the treatment used by the home hero surface so it can be
reused on other painting-backed heroes. Reads `--surface-shape-height` from an
ancestor (fallback 500px) for its height, and fills with `currentColor` (default:
the chrome fill) so a consumer can recolor it by setting `color` on the element.
-->
<template>
  <div class="hero-surface-shape" aria-hidden="true">
    <svg viewBox="0 0 1440 520" preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id="heroSurfaceMist" x1="0" x2="0" y1="0" y2="1">
          <stop class="hero-surface-stop-mist-start" offset="0%" stop-color="currentColor" />
          <stop class="hero-surface-stop-mist-mid" offset="58%" stop-color="currentColor" />
          <stop class="hero-surface-stop-mist-end" offset="100%" stop-color="currentColor" />
        </linearGradient>
        <linearGradient id="heroSurfaceFeather" x1="0" x2="0" y1="0" y2="1">
          <stop class="hero-surface-stop-feather-start" offset="0%" stop-color="currentColor" />
          <stop class="hero-surface-stop-feather-mid" offset="46%" stop-color="currentColor" />
          <stop class="hero-surface-stop-feather-end" offset="100%" stop-color="currentColor" />
        </linearGradient>
      </defs>
      <path
        class="hero-surface-mist"
        d="M0 132 C170 108 344 104 512 126 C660 146 788 172 930 140 C1092 104 1266 110 1440 144 L1440 202 C1264 154 1084 138 922 172 C784 202 650 184 504 166 C332 144 164 166 0 198 Z"
      />
      <path
        class="hero-surface-mist hero-surface-mist-secondary"
        d="M0 154 C154 126 320 118 500 140 C650 158 778 186 920 154 C1080 118 1266 126 1440 166 L1440 216 C1262 166 1082 150 922 184 C784 214 650 196 504 178 C332 156 164 178 0 210 Z"
      />
      <path
        class="hero-surface-feather"
        d="M0 188 C164 160 332 144 504 166 C650 184 784 202 922 172 C1084 138 1264 154 1440 202 L1440 224 C1264 178 1084 162 922 196 C784 224 650 208 504 190 C332 170 164 190 0 222 Z"
      />
      <path
        class="hero-surface-feather hero-surface-feather-secondary"
        d="M0 202 C160 174 326 158 502 180 C650 198 784 216 922 188 C1086 154 1264 170 1440 216 L1440 236 C1262 190 1084 174 922 208 C784 236 650 220 504 202 C332 182 164 202 0 234 Z"
      />
      <path
        class="hero-surface-fill"
        d="M0 222 C164 190 332 170 504 190 C650 208 784 224 922 196 C1084 162 1264 178 1440 224 L1440 520 L0 520 Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.hero-surface-shape {
  position: absolute;
  inset: auto 0 -2px;
  z-index: 2;
  height: calc(var(--surface-shape-height, 500px) + 2px);
  color: var(--color-chrome-fill);
  pointer-events: none;
}

.hero-surface-shape svg {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-surface-mist {
  fill: url('#heroSurfaceMist');
  opacity: 0.78;
}

.hero-surface-feather {
  fill: url('#heroSurfaceFeather');
}

.hero-surface-mist-secondary {
  opacity: 0.42;
}

.hero-surface-feather-secondary {
  opacity: 0.34;
}

.hero-surface-stop-mist-start {
  stop-opacity: 0;
}

.hero-surface-stop-mist-mid {
  animation: hero-surface-mist-mid-opacity 8.5s ease-in-out infinite alternate;
  stop-opacity: 0.16;
}

.hero-surface-stop-mist-end {
  animation: hero-surface-mist-end-opacity 10s ease-in-out infinite alternate;
  stop-opacity: 0.42;
}

.hero-surface-stop-feather-start {
  animation: hero-surface-feather-start-opacity 9s ease-in-out infinite alternate;
  stop-opacity: 0.18;
}

.hero-surface-stop-feather-mid {
  animation: hero-surface-feather-mid-opacity 7.5s ease-in-out infinite alternate;
  stop-opacity: 0.72;
}

.hero-surface-stop-feather-end {
  stop-opacity: 1;
}

.hero-surface-fill {
  fill: currentColor;
}

@keyframes hero-surface-mist-mid-opacity {
  from {
    stop-opacity: 0.08;
  }

  to {
    stop-opacity: 0.22;
  }
}

@keyframes hero-surface-mist-end-opacity {
  from {
    stop-opacity: 0.34;
  }

  to {
    stop-opacity: 0.5;
  }
}

@keyframes hero-surface-feather-start-opacity {
  from {
    stop-opacity: 0.1;
  }

  to {
    stop-opacity: 0.26;
  }
}

@keyframes hero-surface-feather-mid-opacity {
  from {
    stop-opacity: 0.58;
  }

  to {
    stop-opacity: 0.84;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-surface-stop-mist-mid,
  .hero-surface-stop-mist-end,
  .hero-surface-stop-feather-start,
  .hero-surface-stop-feather-mid {
    animation: none;
  }
}
</style>
