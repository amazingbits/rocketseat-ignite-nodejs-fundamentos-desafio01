import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/buildRoutePath.js";
import { validateParams } from "./utils/validateParams.js";
import { send } from "./utils/makeResponse.js";
import { moment } from "./utils/moment.js";
import { proccessFile } from "./csvParse.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      const { q } = request.query;

      const searchParams = q ? {
        title: q,
        description: q,
      } : null;

      const users = database.select("tasks", searchParams);
      return response.end(JSON.stringify(users));
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (request, response) => {

      const schema = {
        title: "string",
        description: "string"
      }

      try {
        validateParams(request.body, schema);

        // Inserting CSV records
        const records = await proccessFile();
        records.forEach(([title, description]) => {
          const task = {
            title,
            description,
            id: randomUUID(),
            completed_at: null,
            created_at: moment(new Date()),
            updated_at: null,
          }

          database.insert("tasks", task);
        });
        // ---------------------------------------

        const { title, description } = request.body;

        const task = {
          title,
          description,
          id: randomUUID(),
          completed_at: null,
          created_at: moment(new Date()),
          updated_at: null,
        }

        database.insert("tasks", task);

        response.writeHead(201).end();

      } catch(err) {
        send(response, { ok: false, message: err.message }, 400);
      }
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      
      const schema = {
        title: "string",
        description: "string"
      }

      try {
        validateParams(request.body, schema);

        const { id } = request.params;
        const userExists = database.getById("tasks", id);
        if(userExists.length === 0) {
          return send(response, { ok: true, message: "User not found" }, 404);
        }

        const { title, description } = request.body;
        const updated_at = moment(new Date());
        database.update("tasks", id, { title, description, updated_at });
        return response.writeHead(204).end();
      } catch(err) {
        return send(response, { ok: false, message: err.message }, 400);
      }
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      const { id } = request.params;
      const userExists = database.getById("tasks", id);
      if(userExists.length === 0) {
        return send(response, { ok: true, message: "User not found" }, 404);
      }
      database.delete("tasks", id);
      return response.writeHead(204).end();
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      const { id } = request.params;
      const userExists = database.getById("tasks", id);
      if(userExists.length === 0) {
        return send(response, { ok: true, message: "User not found" }, 404);
      }
      const completed_at = moment(new Date());
      database.update("tasks", id, { completed_at });
      return response.writeHead(204).end();
    }
  }
];