// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import svgr from "vite-plugin-svgr";
// import path from 'path'
// // https://vite.dev/config/
// export default defineConfig({
//   base: "/",
//   plugins: [react(),
//     tailwindcss(),
//     svgr({
//       svgrOptions: {
//         icon: true,
//         exportType: "named",
//         namedExport: "ReactComponent",
//       },
//     }),
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
  
// })





import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],

  resolve: {
    alias: [
      {
        find: /^@\/lib(?=\/|$)/,
        replacement: path.resolve(__dirname, "./lib"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
});
