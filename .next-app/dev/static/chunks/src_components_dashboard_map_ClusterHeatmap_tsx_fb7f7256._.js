(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/dashboard/map/ClusterHeatmap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClusterHeatmap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/CircleMarker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2e$heat$2f$dist$2f$leaflet$2d$heat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet.heat/dist/leaflet-heat.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const DEFAULT_CENTER = [
    20.5937,
    78.9629
];
const DEFAULT_ZOOM = 5;
function ClusterHeatmap({ days, onMarkerClick }) {
    _s();
    const [clusters, setClusters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClusterHeatmap.useEffect": ()=>{
            let isMounted = true;
            async function fetchMapData() {
                try {
                    setLoading(true);
                    const res = await fetch(`/api/analytics/cluster-intelligence?days=${days}`);
                    if (!res.ok) {
                        throw new Error("Failed to fetch map data");
                    }
                    const data = await res.json();
                    if (!isMounted) {
                        return;
                    }
                    setClusters(Array.isArray(data.clusters) ? data.clusters : []);
                    setError(null);
                } catch  {
                    if (!isMounted) {
                        return;
                    }
                    setError("Failed to load map data");
                } finally{
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            }
            fetchMapData();
            return ({
                "ClusterHeatmap.useEffect": ()=>{
                    isMounted = false;
                }
            })["ClusterHeatmap.useEffect"];
        }
    }["ClusterHeatmap.useEffect"], [
        days
    ]);
    const validClusters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ClusterHeatmap.useMemo[validClusters]": ()=>clusters.filter({
                "ClusterHeatmap.useMemo[validClusters]": (c)=>Number.isFinite(c.latitude) && Number.isFinite(c.longitude)
            }["ClusterHeatmap.useMemo[validClusters]"])
    }["ClusterHeatmap.useMemo[validClusters]"], [
        clusters
    ]);
    const maxDemand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ClusterHeatmap.useMemo[maxDemand]": ()=>validClusters.reduce({
                "ClusterHeatmap.useMemo[maxDemand]": (max, cluster)=>Math.max(max, cluster.currentDemandScore)
            }["ClusterHeatmap.useMemo[maxDemand]"], 0) || 1
    }["ClusterHeatmap.useMemo[maxDemand]"], [
        validClusters
    ]);
    const heatPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ClusterHeatmap.useMemo[heatPoints]": ()=>validClusters.map({
                "ClusterHeatmap.useMemo[heatPoints]": (cluster)=>[
                        cluster.latitude,
                        cluster.longitude,
                        Math.max(0.1, cluster.currentDemandScore / maxDemand)
                    ]
            }["ClusterHeatmap.useMemo[heatPoints]"])
    }["ClusterHeatmap.useMemo[heatPoints]"], [
        maxDemand,
        validClusters
    ]);
    const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ClusterHeatmap.useMemo[bounds]": ()=>{
            if (validClusters.length === 0) {
                return null;
            }
            return validClusters.map({
                "ClusterHeatmap.useMemo[bounds]": (cluster)=>[
                        cluster.latitude,
                        cluster.longitude
                    ]
            }["ClusterHeatmap.useMemo[bounds]"]);
        }
    }["ClusterHeatmap.useMemo[bounds]"], [
        validClusters
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-zinc-500",
                children: "Loading map..."
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-[#FF453A]",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    }
    if (validClusters.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-72 items-center justify-center rounded-xl border border-dashed border-zinc-700",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-zinc-500",
                children: "No clusters available for this period"
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
            lineNumber: 120,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-72 overflow-hidden rounded-xl border border-zinc-800",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
            center: DEFAULT_CENTER,
            className: "h-full w-full",
            scrollWheelZoom: false,
            zoom: DEFAULT_ZOOM,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeatLayer, {
                    max: 1,
                    points: heatPoints,
                    radius: Math.max(18, Math.min(40, 20 + validClusters.length / 2))
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                bounds ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FitToBounds, {
                    bounds: bounds
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                    lineNumber: 145,
                    columnNumber: 19
                }, this) : null,
                validClusters.map((cluster)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$CircleMarker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CircleMarker"], {
                        center: [
                            cluster.latitude,
                            cluster.longitude
                        ],
                        eventHandlers: {
                            click: ()=>onMarkerClick?.(cluster)
                        },
                        pathOptions: {
                            color: "#4F7CFF",
                            fillColor: "#4F7CFF",
                            fillOpacity: 0.7
                        },
                        radius: 4,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-zinc-900",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Cluster:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            cluster.clusterId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Demand:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                                lineNumber: 167,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            cluster.currentDemandScore.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Opportunity:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            cluster.opportunityScore.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                        lineNumber: 169,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Competition:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            cluster.competitionIndex.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                                lineNumber: 162,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this)
                    }, cluster.clusterId, false, {
                        fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
            lineNumber: 128,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/dashboard/map/ClusterHeatmap.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(ClusterHeatmap, "q/bpwOacYR+Z27l7iQ1x0S7PHkc=");
_c = ClusterHeatmap;
function HeatLayer({ points, radius, max }) {
    _s1();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeatLayer.useEffect": ()=>{
            if (points.length === 0) {
                return;
            }
            const layer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].heatLayer(points, {
                radius,
                blur: 20,
                max,
                minOpacity: 0.35,
                gradient: {
                    0.2: "#1D4ED8",
                    0.5: "#4F7CFF",
                    0.7: "#30D158",
                    1.0: "#FF453A"
                }
            });
            layer.addTo(map);
            return ({
                "HeatLayer.useEffect": ()=>{
                    map.removeLayer(layer);
                }
            })["HeatLayer.useEffect"];
        }
    }["HeatLayer.useEffect"], [
        map,
        max,
        points,
        radius
    ]);
    return null;
}
_s1(HeatLayer, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c1 = HeatLayer;
function FitToBounds({ bounds }) {
    _s2();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FitToBounds.useEffect": ()=>{
            map.fitBounds(bounds, {
                padding: [
                    24,
                    24
                ],
                maxZoom: 12
            });
        }
    }["FitToBounds.useEffect"], [
        bounds,
        map
    ]);
    return null;
}
_s2(FitToBounds, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c2 = FitToBounds;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ClusterHeatmap");
__turbopack_context__.k.register(_c1, "HeatLayer");
__turbopack_context__.k.register(_c2, "FitToBounds");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/dashboard/map/ClusterHeatmap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/dashboard/map/ClusterHeatmap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_dashboard_map_ClusterHeatmap_tsx_fb7f7256._.js.map