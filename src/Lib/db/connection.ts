/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Knex from "knex";

export class DataBaseConnection {
  config: Knex.Config = {
    client: "pg",
    connection: {
      port: process.env.POSTGRES_PORT as unknown as number,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  };

  knexConn = Knex(this.config);
  getConnection() {
    return this.knexConn;
  }
}
