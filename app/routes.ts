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
      route("inventory", "./routes/jobs/create.inventory.tsx",[
        route("materials", "./routes/jobs/create.inventory.materials.tsx"),
        route("colors", "./routes/jobs/create.inventory.colors.tsx")
      ]),
    ]),
  ]),
  route("barcode", "./routes/barcode.tsx"),
] satisfies RouteConfig;
