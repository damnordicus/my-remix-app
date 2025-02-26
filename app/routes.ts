import {
  type RouteConfig,
  route,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  // route("inventory", "./routes/inventory.tsx"),

  // layout("./auth/layout.tsx", [
  //   route("login", "./auth/login.tsx"),
  //   route("register", "./auth/register.tsx"),
  // ]),

  route("inventory", "./routes/inventory.tsx", [
    route("create", "./routes/inventory/inventory.create.tsx"),
    //   index("./routes/inventory.tsx"),
    route(":itemId", "./routes/inventory/inventory.$itemId.tsx", [
      route("add", "./routes/inventory/inventory.$itemId.add.tsx"),
      route("discard", "./routes/inventory/inventory.$itemId.discard.tsx"),
    ]),
    //   route("trending", "./concerts/trending.tsx"),
  ]),
  route("register", "./routes/register.tsx"),
  route("pull", "./routes/pullFilament.tsx"),
  route("return", "./routes/returnFilament.tsx"),
  route("user", "./routes/jobs/auth.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("showQR", "./routes/showQR.tsx"),
  route("generateBarcode", "./routes/generateBarcode.tsx"),
  
  ...prefix("job", [
    route("auth", "./routes/job.tsx"),
    route("create", "./routes/jobs/create.tsx", [
      route("barcodeReturn", "./routes/jobs/barcodeReturn.tsx"),
      route("inventory", "./routes/jobs/create.inventory.tsx",[
        route("materials", "./routes/jobs/create.inventory.materials.tsx"),
        route("colors", "./routes/jobs/create.inventory.colors.tsx")
      ]),
    ]),
  ]),
  route("barcode", "./routes/barcode.tsx"),
  ...prefix("view", [
    route("accounts", "./routes/view/view.accounts.tsx",[
       route(":userId/jobs", "./routes/view/view.accounts.$userId.jobs.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
