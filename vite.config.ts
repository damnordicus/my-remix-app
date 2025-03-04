import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import fs from 'node:fs';

export default defineConfig({
  server:{
    // proxy: {},
    // https: {
    //   key: fs.readFileSync('nord-razer-dev.lemur-dominant.ts.net.key'),
    //   cert: fs.readFileSync('nord-razer-dev.lemur-dominant.ts.net.crt')
    // },
    warmup: {
      clientFiles: ['./app/root.tsx'],
    },
    allowedHosts: true,
    // port: 3000
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
