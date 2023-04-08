import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { formatDate } from "./utils/formatDate.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (!req.body || !req.body?.title || !req.body?.description) {
        return res.writeHead(400).end();
      }

      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: formatDate(),
        updated_at: null,
      };

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.delete("tasks", id);
        return res.writeHead(204).end();
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify(error.message));
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      if (!req.body || (!req.body?.title && !req.body?.description)) {
        return res.writeHead(400).end();
      }

      try {
        database.update("tasks", id, req.body);
        return res.writeHead(204).end();
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify(error.message));
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.updateTaskCompleted("tasks", id);
        return res.writeHead(204).end();
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify(error.message));
      }
    },
  },
];
