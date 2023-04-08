import fs from "node:fs/promises";
import { formatDate } from "./utils/formatDate.js";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  findRowIndex(table, id) {
    return this.#database[table]?.findIndex((row) => row.id === id) ?? -1;
  }

  updateRow(table, rowIndex, data) {
    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
    };
  }

  delete(table, id) {
    const rowIndex = this.findRowIndex(table, id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    } else {
      throw new Error(`Registro não encontrado`);
    }
  }

  update(table, id, data) {
    const rowIndex = this.findRowIndex(table, id);

    if (rowIndex > -1) {
      this.updateRow(table, rowIndex, {
        ...data,
        updated_at: formatDate(),
      });
      this.#persist();
    } else {
      throw new Error(`Registro não encontrado`);
    }
  }

  updateTaskCompleted(table, id) {
    const rowIndex = this.findRowIndex(table, id);

    if (rowIndex > -1) {
      this.updateRow(table, rowIndex, {
        completed_at: !this.#database[table][rowIndex].completed_at,
        updated_at: formatDate(),
      });
      this.#persist();
    } else {
      throw new Error(`Registro não encontrado`);
    }
  }
}
