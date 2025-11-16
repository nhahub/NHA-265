module.exports = [
"[externals]/react-leaflet [external] (react-leaflet, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("react-leaflet");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/leaflet [external] (leaflet, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("leaflet", () => require("leaflet"));

module.exports = mod;
}),
"[project]/components/layout/MapComponent.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/react-leaflet [external] (react-leaflet, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$leaflet__$5b$external$5d$__$28$leaflet$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/leaflet [external] (leaflet, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
__TURBOPACK__imported__module__$5b$externals$5d2f$leaflet__$5b$external$5d$__$28$leaflet$2c$__cjs$29$__["default"].Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
// Workaround: allow using MapContainer with flexible props (avoids strict JSX prop typing issues)
const AnyMapContainer = __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__["MapContainer"];
const MapComponent = ({ markers })=>{
    const defaultPosition = [
        30.0444,
        31.2357
    ];
    const mapCenter = markers.length > 0 ? [
        markers[0].lat,
        markers[0].lng
    ] : defaultPosition;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AnyMapContainer, {
        center: mapCenter,
        zoom: 10,
        style: {
            height: '100%',
            width: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__["TileLayer"], {
                ...{
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
            }, void 0, false, {
                fileName: "[project]/components/layout/MapComponent.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            markers.map((marker, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__["Marker"], {
                    position: [
                        marker.lat,
                        marker.lng
                    ],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$leaflet__$5b$external$5d$__$28$react$2d$leaflet$2c$__esm_import$29$__["Popup"], {
                        children: marker.popupText
                    }, void 0, false, {
                        fileName: "[project]/components/layout/MapComponent.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, index, false, {
                    fileName: "[project]/components/layout/MapComponent.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/MapComponent.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MapComponent;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/layout/MapComponent.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/layout/MapComponent.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__203723c3._.js.map