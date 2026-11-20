module.exports = {
    content: ["./src/**/*.jsx"],
  theme: {
      extend: {
        fontFamily: {
          heading: ['"Instrument Serif"', 'serif'],
          body: ['"Barlow"', 'sans-serif'],
          pxHeading: ['"Space Grotesk"', 'sans-serif'],
          pxBody: ['"Inter"', 'sans-serif'],
          pxMono: ['"JetBrains Mono"', 'monospace'],
          kyroHeading: ['"Playfair Display"', 'serif'],
          kyroBody: ['"Inter"', 'sans-serif'],
        },
        borderRadius: {
          DEFAULT: '9999px',
        },
        colors: {
          pxBg: '#07080A',
          pxAccent: '#4AFF9E',
          pxAccent2: '#22D3EE',
          pxMuted: '#868C93',
          pxCard: 'rgba(255,255,255,0.03)',
          pxLine: 'rgba(255,255,255,0.09)',
          kyroBg: '#0B0B0C',
          kyroRed: '#E4312B',
          kyroRedDeep: '#7A1013',
          kyroCard: 'rgba(255,255,255,0.035)',
          kyroLine: 'rgba(255,255,255,0.09)',
          kyroMuted: '#9CA3AF',
          kyroText: '#F5F1EC',
        },
      },
    },
  };
