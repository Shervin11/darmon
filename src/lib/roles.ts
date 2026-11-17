/** Landing page for each role after sign-in (also used by the route middleware). */
export const ROLE_HOME: Record<string, string> = {
  admin: "/admin/panel",
  clinic: "/clinic/dashboard",
  registrar: "/clinic/desk",
  doctor: "/dashboard",
  client: "/doctors",
};

/** Route prefixes reserved for some roles (the most specific prefix wins); other private pages are open to any signed-in user. */
export const ROLE_ROUTES: [prefix: string, roles: string[]][] = [
  ["/clinic/desk", ["clinic", "registrar"]],
  ["/clinic", ["clinic"]],
  ["/admin", ["admin"]],
  ["/dashboard", ["doctor"]],
  ["/protocol", ["doctor"]],
  ["/appointments", ["client"]],
  ["/wishlist", ["client"]],
  ["/records", ["client"]],
];
