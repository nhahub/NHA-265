(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/layout/MapComponent.tsx [client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/node_modules_906a5c98._.js",
  "static/chunks/components_layout_MapComponent_tsx_69fcee7f._.js",
  {
    "path": "static/chunks/node_modules_leaflet_dist_leaflet_6634502f.css",
    "included": [
      "[project]/node_modules/leaflet/dist/leaflet.css [client] (css)"
    ]
  },
  "static/chunks/components_layout_MapComponent_tsx_593889df._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/components/layout/MapComponent.tsx [client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);