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
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jsonError",
    ()=>jsonError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
function jsonError(message, status) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status
    });
}
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthContext",
    ()=>getAuthContext,
    "requireAnyRole",
    ()=>requireAnyRole,
    "requireRole",
    ()=>requireRole,
    "signToken",
    ()=>signToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-route] (ecmascript)");
;
;
function signToken(payload) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is required");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, jwtSecret, {
        expiresIn: "7d"
    });
}
function getJwtSecret() {
    return process.env.JWT_SECRET ?? null;
}
function verifyToken(token) {
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
        return null;
    }
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, jwtSecret);
        if (typeof decoded.userId !== "number" || decoded.role !== "CUSTOMER" && decoded.role !== "VENDOR" && decoded.role !== "ADMIN") {
            return null;
        }
        return {
            userId: decoded.userId,
            role: decoded.role
        };
    } catch  {
        return null;
    }
}
function getAuthContext(request) {
    const header = request.headers.get("authorization");
    if (!header || !header.startsWith("Bearer ")) {
        return {
            auth: null,
            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("Unauthorized", 401)
        };
    }
    const token = header.slice("Bearer ".length).trim();
    const auth = verifyToken(token);
    if (!auth) {
        return {
            auth: null,
            error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("Invalid token", 401)
        };
    }
    return {
        auth,
        error: null
    };
}
function requireRole(auth, role) {
    if (auth.role !== role) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("Forbidden", 403);
    }
    return null;
}
function requireAnyRole(auth, roles) {
    if (!roles.includes(auth.role)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonError"])("Forbidden", 403);
    }
    return null;
}
}),
"[project]/src/app/api/vendor/analytics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
;
;
function deriveCategory(productName) {
    const value = productName.toLowerCase();
    if (value.includes("bread") || value.includes("bake")) return "Bakery";
    if (value.includes("egg") || value.includes("milk") || value.includes("cheese")) return "Dairy";
    if (value.includes("coffee") || value.includes("drink") || value.includes("tea")) return "Beverages";
    if (value.includes("fruit") || value.includes("vegetable") || value.includes("avocado")) return "Produce";
    return "General";
}
async function GET(request) {
    const { auth, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthContext"])(request);
    if (error) {
        return error;
    }
    const roleError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireRole"])(auth, "VENDOR");
    if (roleError) {
        return roleError;
    }
    try {
        const store = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].store.findUnique({
            where: {
                vendorId: auth.userId
            },
            select: {
                id: true
            }
        });
        if (!store) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Store not found"
            }, {
                status: 404
            });
        }
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
            where: {
                storeId: store.id
            },
            select: {
                id: true,
                name: true
            }
        });
        const totalProducts = products.length;
        const productIds = products.map((product)=>product.id);
        if (productIds.length === 0) {
            const emptyResponse = {
                totalProducts,
                totalClicks: 0,
                totalCartAdds: 0,
                totalPurchases: 0,
                totalRevenue: 0,
                topProducts: [],
                categorySales: []
            };
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(emptyResponse, {
                status: 200
            });
        }
        const [interactionCounts, purchaseCounts, orderItems] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interactionLog.groupBy({
                by: [
                    "action"
                ],
                where: {
                    productId: {
                        in: productIds
                    },
                    action: {
                        in: [
                            "CLICK",
                            "ADD_TO_CART",
                            "PURCHASE"
                        ]
                    }
                },
                _count: {
                    _all: true
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interactionLog.groupBy({
                by: [
                    "productId"
                ],
                where: {
                    productId: {
                        in: productIds
                    },
                    action: "PURCHASE"
                },
                _count: {
                    _all: true
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].orderItem.findMany({
                where: {
                    productId: {
                        in: productIds
                    }
                },
                select: {
                    productId: true,
                    price: true,
                    quantity: true
                }
            })
        ]);
        let totalClicks = 0;
        let totalCartAdds = 0;
        let totalPurchases = 0;
        for (const row of interactionCounts){
            if (row.action === "CLICK") {
                totalClicks = row._count._all;
            } else if (row.action === "ADD_TO_CART") {
                totalCartAdds = row._count._all;
            } else if (row.action === "PURCHASE") {
                totalPurchases = row._count._all;
            }
        }
        const totalRevenue = orderItems.reduce((sum, item)=>sum + item.price * item.quantity, 0);
        const productNameById = new Map(products.map((product)=>[
                product.id,
                product.name
            ]));
        const topProducts = purchaseCounts.map((row)=>({
                id: row.productId,
                name: productNameById.get(row.productId) ?? "Unknown Product",
                totalPurchases: row._count._all
            })).sort((a, b)=>b.totalPurchases - a.totalPurchases);
        const response = {
            totalProducts,
            totalClicks,
            totalCartAdds,
            totalPurchases,
            totalRevenue,
            topProducts,
            categorySales: buildCategorySales(orderItems, productNameById)
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
            status: 200
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to fetch vendor analytics"
        }, {
            status: 500
        });
    }
}
function buildCategorySales(orderItems, productNameById) {
    const categoryMap = new Map();
    for (const item of orderItems){
        const productName = productNameById.get(item.productId) ?? "";
        const category = deriveCategory(productName);
        const current = categoryMap.get(category) ?? {
            category,
            revenue: 0,
            unitsSold: 0,
            orders: 0
        };
        current.revenue += item.price * item.quantity;
        current.unitsSold += item.quantity;
        current.orders += 1;
        categoryMap.set(category, current);
    }
    return Array.from(categoryMap.values()).map((entry)=>({
            ...entry,
            revenue: Number(entry.revenue.toFixed(2))
        })).sort((a, b)=>b.revenue - a.revenue);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7a5484bc._.js.map