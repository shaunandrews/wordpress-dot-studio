export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox so inlined SVGs scale to their container.
          removeViewBox: false,
          // Fold only the dark "ink" colors to currentColor so illustrations
          // follow text color. White ("paper") and none are left intact.
          convertColors: { currentColor: /^(#1d1f1f|black)$/i },
        },
      },
    },
    // Namespace internal ids (clip paths, gradients) per file so multiple
    // inlined SVGs can't collide in the shared document.
    'prefixIds',
  ],
};
