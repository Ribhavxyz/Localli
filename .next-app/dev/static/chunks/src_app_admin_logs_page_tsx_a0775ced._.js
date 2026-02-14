(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/admin/logs/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminLogsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AdminLogsPage() {
    _s();
    const [clusters, setClusters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminLogsPage.useEffect": ()=>{
            let active = true;
            async function loadData() {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await fetch("/api/analytics/cluster-intelligence?days=7");
                    if (!response.ok) {
                        throw new Error("Failed to load logs data");
                    }
                    const data = await response.json();
                    if (!active) {
                        return;
                    }
                    setClusters(Array.isArray(data.clusters) ? data.clusters : []);
                } catch (err) {
                    if (!active) {
                        return;
                    }
                    setError(err instanceof Error ? err.message : "Unable to load logs");
                } finally{
                    if (active) {
                        setLoading(false);
                    }
                }
            }
            void loadData();
            return ({
                "AdminLogsPage.useEffect": ()=>{
                    active = false;
                }
            })["AdminLogsPage.useEffect"];
        }
    }["AdminLogsPage.useEffect"], []);
    const logs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminLogsPage.useMemo[logs]": ()=>{
            const now = new Date();
            const entries = [];
            for (const cluster of clusters){
                if (cluster.isSurging) {
                    entries.push({
                        id: `surge-${cluster.clusterId}`,
                        timestamp: now.toISOString(),
                        level: "success",
                        message: `Cluster ${cluster.clusterId} marked as surging (${cluster.growthRate.toFixed(1)}% growth).`
                    });
                }
                if (cluster.competitionIndex >= 6) {
                    entries.push({
                        id: `comp-${cluster.clusterId}`,
                        timestamp: now.toISOString(),
                        level: "warning",
                        message: `Cluster ${cluster.clusterId} high competition index ${cluster.competitionIndex.toFixed(2)}.`
                    });
                }
                if (!cluster.isSurging && cluster.growthRate < 0) {
                    entries.push({
                        id: `drop-${cluster.clusterId}`,
                        timestamp: now.toISOString(),
                        level: "info",
                        message: `Cluster ${cluster.clusterId} demand declined by ${Math.abs(cluster.growthRate).toFixed(1)}%.`
                    });
                }
            }
            return entries.slice(0, 25);
        }
    }["AdminLogsPage.useMemo[logs]"], [
        clusters
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-5xl font-bold tracking-tight md:text-6xl",
                children: "Logs"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/logs/page.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 text-zinc-300",
                children: "Loading logs..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/logs/page.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-red-300",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/admin/logs/page.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: logs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-zinc-400",
                    children: "No recent events."
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/logs/page.tsx",
                    lineNumber: 120,
                    columnNumber: 13
                }, this) : logs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "rounded-xl border border-zinc-800 bg-zinc-900/90 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `rounded-md px-2 py-1 text-xs uppercase tracking-wide ${log.level === "success" ? "bg-emerald-950/60 text-emerald-300" : log.level === "warning" ? "bg-amber-950/60 text-amber-300" : "bg-blue-950/60 text-blue-300"}`,
                                        children: log.level
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/logs/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-zinc-500",
                                        children: new Date(log.timestamp).toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/logs/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/logs/page.tsx",
                                lineNumber: 129,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-zinc-200",
                                children: log.message
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/logs/page.tsx",
                                lineNumber: 145,
                                columnNumber: 17
                            }, this)
                        ]
                    }, log.id, true, {
                        fileName: "[project]/src/app/admin/logs/page.tsx",
                        lineNumber: 125,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/admin/logs/page.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/logs/page.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
_s(AdminLogsPage, "tY/kGaS0T/KFKF45efrQ0qLpFYE=");
_c = AdminLogsPage;
var _c;
__turbopack_context__.k.register(_c, "AdminLogsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_admin_logs_page_tsx_a0775ced._.js.map