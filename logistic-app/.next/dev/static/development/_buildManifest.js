self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/admin": [
    "static/chunks/pages/admin.js"
  ],
  "/admin/cities": [
    "static/chunks/pages/admin/cities.js"
  ],
  "/admin/drivers": [
    "static/chunks/pages/admin/drivers.js"
  ],
  "/admin/vehicles": [
    "static/chunks/pages/admin/vehicles.js"
  ],
  "/auth/login": [
    "static/chunks/pages/auth/login.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/admin",
    "/admin/cities",
    "/admin/drivers",
    "/admin/shipments",
    "/admin/users",
    "/admin/vehicles",
    "/auth/login",
    "/auth/register",
    "/customer",
    "/customer/new-shipment",
    "/customer/shipments/[id]",
    "/driver",
    "/login",
    "/register"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()