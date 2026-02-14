module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const prisma = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        "query"
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/app/api/analytics/cluster-demand/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
function computeDemandScore(values) {
    return values.totalPurchases * 5 + values.totalCartAdds * 2 + values.totalRevenue * 0.1;
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const daysParam = searchParams.get("days");
        if (daysParam === null || daysParam.trim() === "") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "days query parameter is required"
            }, {
                status: 400
            });
        }
        const days = Number(daysParam);
        if (!Number.isFinite(days) || days <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "days must be a positive number"
            }, {
                status: 400
            });
        }
        const now = new Date();
        const currentStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const previousStart = new Date(now.getTime() - 2 * days * 24 * 60 * 60 * 1000);
        const [currentInteractions, previousInteractions, currentOrderItems, previousOrderItems] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interactionLog.findMany({
                where: {
                    action: {
                        in: [
                            "PURCHASE",
                            "ADD_TO_CART"
                        ]
                    },
                    createdAt: {
                        gte: currentStart,
                        lte: now
                    }
                },
                select: {
                    action: true,
                    product: {
                        select: {
                            store: {
                                select: {
                                    clusterId: true,
                                    lat: true,
                                    lng: true
                                }
                            }
                        }
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interactionLog.findMany({
                where: {
                    action: {
                        in: [
                            "PURCHASE",
                            "ADD_TO_CART"
                        ]
                    },
                    createdAt: {
                        gte: previousStart,
                        lt: currentStart
                    }
                },
                select: {
                    action: true,
                    product: {
                        select: {
                            store: {
                                select: {
                                    clusterId: true,
                                    lat: true,
                                    lng: true
                                }
                            }
                        }
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderItem.findMany({
                where: {
                    order: {
                        createdAt: {
                            gte: currentStart,
                            lte: now
                        }
                    }
                },
                select: {
                    price: true,
                    quantity: true,
                    product: {
                        select: {
                            store: {
                                select: {
                                    clusterId: true,
                                    lat: true,
                                    lng: true
                                }
                            }
                        }
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderItem.findMany({
                where: {
                    order: {
                        createdAt: {
                            gte: previousStart,
                            lt: currentStart
                        }
                    }
                },
                select: {
                    price: true,
                    quantity: true,
                    product: {
                        select: {
                            store: {
                                select: {
                                    clusterId: true,
                                    lat: true,
                                    lng: true
                                }
                            }
                        }
                    }
                }
            })
        ]);
        const currentClusterMap = new Map();
        const previousClusterMap = new Map();
        const clusterGeoMap = new Map();
        for (const interaction of currentInteractions){
            const clusterId = interaction.product.store.clusterId;
            const lat = interaction.product.store.lat;
            const lng = interaction.product.store.lng;
            const values = currentClusterMap.get(clusterId) ?? {
                totalPurchases: 0,
                totalCartAdds: 0,
                totalRevenue: 0
            };
            if (interaction.action === "PURCHASE") {
                values.totalPurchases += 1;
            } else if (interaction.action === "ADD_TO_CART") {
                values.totalCartAdds += 1;
            }
            currentClusterMap.set(clusterId, values);
            const geo = clusterGeoMap.get(clusterId) ?? {
                latSum: 0,
                lngSum: 0,
                count: 0
            };
            geo.latSum += lat ?? 0;
            geo.lngSum += lng ?? 0;
            geo.count += 1;
            clusterGeoMap.set(clusterId, geo);
        }
        for (const orderItem of currentOrderItems){
            const clusterId = orderItem.product.store.clusterId;
            const lat = orderItem.product.store.lat;
            const lng = orderItem.product.store.lng;
            const values = currentClusterMap.get(clusterId) ?? {
                totalPurchases: 0,
                totalCartAdds: 0,
                totalRevenue: 0
            };
            values.totalRevenue += orderItem.price * orderItem.quantity;
            currentClusterMap.set(clusterId, values);
            const geo = clusterGeoMap.get(clusterId) ?? {
                latSum: 0,
                lngSum: 0,
                count: 0
            };
            geo.latSum += lat ?? 0;
            geo.lngSum += lng ?? 0;
            geo.count += 1;
            clusterGeoMap.set(clusterId, geo);
        }
        for (const interaction of previousInteractions){
            const clusterId = interaction.product.store.clusterId;
            const values = previousClusterMap.get(clusterId) ?? {
                totalPurchases: 0,
                totalCartAdds: 0,
                totalRevenue: 0
            };
            if (interaction.action === "PURCHASE") {
                values.totalPurchases += 1;
            } else if (interaction.action === "ADD_TO_CART") {
                values.totalCartAdds += 1;
            }
            previousClusterMap.set(clusterId, values);
        }
        for (const orderItem of previousOrderItems){
            const clusterId = orderItem.product.store.clusterId;
            const values = previousClusterMap.get(clusterId) ?? {
                totalPurchases: 0,
                totalCartAdds: 0,
                totalRevenue: 0
            };
            values.totalRevenue += orderItem.price * orderItem.quantity;
            previousClusterMap.set(clusterId, values);
        }
        const allClusterIds = new Set([
            ...Array.from(currentClusterMap.keys()),
            ...Array.from(previousClusterMap.keys())
        ]);
        const clusters = Array.from(allClusterIds).map((clusterId)=>{
            const currentValues = currentClusterMap.get(clusterId) ?? {
                totalPurchases: 0,
                totalCartAdds: 0,
                totalRevenue: 0
            };
            const previousValues = previousClusterMap.get(clusterId) ?? {
                totalPurchases: 0,
                totalCartAdds: 0,
                totalRevenue: 0
            };
            const currentDemandScore = computeDemandScore(currentValues);
            const previousDemandScore = computeDemandScore(previousValues);
            let growthRate = 0;
            if (previousDemandScore > 0) {
                growthRate = (currentDemandScore - previousDemandScore) / previousDemandScore * 100;
            } else if (currentDemandScore > 0) {
                growthRate = 100;
            }
            const isSurging = growthRate >= 50 && currentDemandScore >= 20;
            const geo = clusterGeoMap.get(clusterId);
            const latitude = geo && geo.count > 0 ? geo.latSum / geo.count : 0;
            const longitude = geo && geo.count > 0 ? geo.lngSum / geo.count : 0;
            return {
                clusterId,
                currentDemandScore,
                previousDemandScore,
                growthRate,
                isSurging,
                latitude,
                longitude
            };
        }).sort((a, b)=>{
            if (a.isSurging !== b.isSurging) {
                return a.isSurging ? -1 : 1;
            }
            return b.growthRate - a.growthRate;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clusters
        }, {
            status: 200
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to compute cluster demand analytics"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__82a4cf0b._.js.map