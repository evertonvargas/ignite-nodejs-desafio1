import http from "node:http";
import { jsonMid } from "./middleware/jsonMid.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await jsonMid(req, res); // middleware

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(decodeURIComponent(query)) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end("Não encotrado");
});

server.listen(4000);
