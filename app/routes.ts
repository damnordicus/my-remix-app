import {
  type RouteConfig,
  route,
  index,
  inventory,
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
    //   index("./routes/inventory.tsx"),
    route(":itemId", "./routes/inventory.$itemId.tsx", [
      route("add", "./routes/inventory.$itemId.add.tsx"),
      route("discard", "./routes/inventory.$itemId.discard.tsx"),
    ]),
    //   route("trending", "./concerts/trending.tsx"),
  ]),
  route("pull", "./routes/pullFilament.tsx"),
  ...prefix("job", [
    route("auth", "./routes/job.tsx"),
    route("create", "./routes/jobs/create.tsx", [
      route("stock", "./routes/job.$userId.stock.tsx"),
    ]),
  ]),
  route("barcode", "./routes/barcode.tsx"),
] satisfies RouteConfig;
