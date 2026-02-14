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
"[project]/src/app/api/analytics/cluster-competition/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
function getOrCreateClusterAccumulator(clusterMap, clusterId) {
    const existing = clusterMap.get(clusterId);
    if (existing) {
        return existing;
    }
    const created = {
        vendorIds: new Set(),
        totalProducts: 0,
        totalPurchases: 0,
        totalCartAdds: 0,
        totalRevenue: 0
    };
    clusterMap.set(clusterId, created);
    return created;
}
async function GET() {
    try {
        const [stores, products, interactions, orderItems] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].store.findMany({
                select: {
                    id: true,
                    clusterId: true,
                    vendorId: true
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
                select: {
                    id: true,
                    storeId: true
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interactionLog.findMany({
                where: {
                    action: {
                        in: [
                            "PURCHASE",
                            "ADD_TO_CART"
                        ]
                    }
                },
                select: {
                    action: true,
                    product: {
                        select: {
                            store: {
                                select: {
                                    clusterId: true
                                }
                            }
                        }
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderItem.findMany({
                select: {
                    price: true,
                    quantity: true,
                    product: {
                        select: {
                            store: {
                                select: {
                                    clusterId: true
                                }
                            }
                        }
                    }
                }
            })
        ]);
        const clusterMap = new Map();
        const storeClusterById = new Map();
        for (const store of stores){
            storeClusterById.set(store.id, store.clusterId);
            const acc = getOrCreateClusterAccumulator(clusterMap, store.clusterId);
            acc.vendorIds.add(store.vendorId);
        }
        for (const product of products){
            const clusterId = storeClusterById.get(product.storeId);
            if (!clusterId) {
                continue;
            }
            const acc = getOrCreateClusterAccumulator(clusterMap, clusterId);
            acc.totalProducts += 1;
        }
        for (const interaction of interactions){
            const clusterId = interaction.product.store.clusterId;
            const acc = getOrCreateClusterAccumulator(clusterMap, clusterId);
            if (interaction.action === "PURCHASE") {
                acc.totalPurchases += 1;
            } else if (interaction.action === "ADD_TO_CART") {
                acc.totalCartAdds += 1;
            }
        }
        for (const orderItem of orderItems){
            const clusterId = orderItem.product.store.clusterId;
            const acc = getOrCreateClusterAccumulator(clusterMap, clusterId);
            acc.totalRevenue += orderItem.price * orderItem.quantity;
        }
        const clusters = Array.from(clusterMap.entries()).map(([clusterId, acc])=>{
            const totalVendors = acc.vendorIds.size;
            const demandScore = acc.totalPurchases * 5 + acc.totalCartAdds * 2 + acc.totalRevenue * 0.1;
            const competitionIndex = totalVendors * 2 + acc.totalProducts;
            const opportunityScore = demandScore / (competitionIndex + 1);
            return {
                clusterId,
                totalVendors,
                totalProducts: acc.totalProducts,
                demandScore,
                competitionIndex,
                opportunityScore
            };
        }).sort((a, b)=>b.opportunityScore - a.opportunityScore);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            clusters
        }, {
            status: 200
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to compute cluster competition analytics"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__43e36967._.js.map