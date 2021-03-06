/**
 * @fileOverview contains the various helper functions  for database operation.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import * as Knex from "knex";

 const addDefaultColumns = (table: Knex.CreateTableBuilder): void => {
   table.timestamps(false, true);
   table.dateTime("deletedAt", { useTz: true });
 };
 
 const createRef = (table: Knex.CreateTableBuilder, foreignTable: string) => {
  return table
     .integer(`${foreignTable}_id`)
     .unsigned()
     .references("_id")
     .inTable(foreignTable)
     .notNullable()
     .onDelete("cascade");
 };
 
 export { addDefaultColumns, createRef };