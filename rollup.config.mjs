import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-commonjs";

export default [
   {
      input: "public/js/index.js",
      output: [
         {
            file: "public/dist/bundle-cjs.js",
            format: "cjs",
            globals: {
               axios: "axios",
            },
         },
         {
            file: "public/dist/bundle-es.js",
            format: "es",
            globals: {
               axios: "axios",
            },
         },
         {
            file: "public/dist/bundle-umd.js",
            format: "umd",
            globals: {
               axios: "axios",
            },
         },
      ],
      external: ["axios", "leaflet"],
      plugins: [json(), nodeResolve({ preferBuiltins: true, browser: true }), commonjs({ include: "node_modules/**" })],
   },
];
