self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/admin": [
    "static/chunks/pages/admin.js"
  ],
  "/auth/login": [
    "static/chunks/pages/auth/login.js"
  ],
  "/customer": [
    "static/chunks/pages/customer.js"
  ],
  "/customer/shipments/[id]": [
    "static/chunks/pages/customer/shipments/[id].js"
  ],
  "/driver": [
    "static/chunks/pages/driver.js"
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
    "/admin/shipments",
    "/admin/users",
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