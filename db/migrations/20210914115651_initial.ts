import * as Knex from "knex";
import TableNames, { orderedTables } from "../../src/Lib/constants";
import { addDefaultColumns, createRef } from "../../src/Lib/db";

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    // Role table - stores all the available roles
    await knex.schema.createTable(
      TableNames.Roles,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        addDefaultColumns(table);
      }
    ),

    // Categories table - stores all the available content categories
    await knex.schema.createTable(
      TableNames.Categories,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        addDefaultColumns(table);
      }
    ),
    // Sub_Categories table - stores all the available subCategories
    await knex.schema.createTable(
      TableNames.Sub_Categories,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, `${TableNames.Categories}`);
        addDefaultColumns(table);
      }
    ),
    // Region table - stores all the available Regions
    await knex.schema.createTable(
      TableNames.region,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        addDefaultColumns(table);
      }
    ),
    // Countries table - stores all the available countries
    await knex.schema.createTable(
      TableNames.Country,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, `${TableNames.region}`);
        addDefaultColumns(table);
      }
    ),
    // University table - stores all the available Universities in the system
    await knex.schema.createTable(
      TableNames.University,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, `${TableNames.Country}`);
        addDefaultColumns(table);
      }
    ),
    // Campus table - stores all the available Campus(es) in the system
    await knex.schema.createTable(
      TableNames.Campuses,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, `${TableNames.University}`);
        addDefaultColumns(table);
      }
    ),
    // Users table
    await knex.schema.createTable(
      TableNames.User,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        table.string("regNo").notNullable();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.string("profilePic").notNullable();
        table.string("gender").notNullable();
        table.string("phone").notNullable();
        table.string("dob").notNullable();
        table.string("status").notNullable();
        table.string("account_status").notNullable();
        table.string("synced").notNullable().defaultTo("online");
        table.date("joined").notNullable();
        createRef(table, TableNames.Campuses);
        addDefaultColumns(table);
      }
    ),
    // AdminUsers table - stores info about the current admins
    await knex.schema.createTable(
      TableNames.Admin_Users,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        createRef(table, `${TableNames.User}`),
          createRef(table, `${TableNames.Roles}`),
          addDefaultColumns(table);
      }
    ),
    // Mentor table - stores all the available mentorships in the institution
    await knex.schema.createTable(
      TableNames.Mentor,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        table.string("description").notNullable();
        addDefaultColumns(table);
      }
    ),
    // Mentorships Program  join table - stores all the available mentorship programs in the institution
    await knex.schema.createTable(
      TableNames.Mentorship,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        createRef(table, `${TableNames.Mentorship}`);
        table
        .integer('mentor_id')
        .unsigned()
        .references("_id")
        .inTable(TableNames.User)
        .notNullable()
        .onDelete("cascade");
        table
        .integer('mentee_id')
        .unsigned()
        .references("_id")
        .inTable(TableNames.User)
        .notNullable()
        .onDelete("cascade");
        addDefaultColumns(table);
      }
    ),
    // Issue_Categories table
    await knex.schema.createTable(
      TableNames.Issue_categories,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        addDefaultColumns(table);
      }
    ),
    // Help table - stores all queries reported
    await knex.schema.createTable(
      TableNames.help,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("issue").notNullable();
        table.string("natureOfComplaint").notNullable();
        table.string("forwardedTo").notNullable();
        table.string("status").notNullable();
        createRef(table, `${TableNames.User}`);
        createRef(table, `${TableNames.Issue_categories}`);
        addDefaultColumns(table);
      }
    ),
    // sms table
    await knex.schema.createTable(
      TableNames.sms,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("event").notNullable();
        table.string("receipient").notNullable();
        table.string("sms").notNullable();
        table.string("date").notNullable().defaultTo(Date.now());
        table.string("status").notNullable();
        createRef(table, `${TableNames.Admin_Users}`);
        addDefaultColumns(table);
      }
    ),
    // failedJobs table
    await knex.schema.createTable(
      TableNames.failedJobs,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("connection").notNullable();
        table.string("queue").notNullable();
        table.string("payload").notNullable();
        table.string("exception").notNullable();
        table.string("failed_at").notNullable().defaultTo(Date.now());
        table.string("status").notNullable();
        createRef(table, `${TableNames.Admin_Users}`);
        addDefaultColumns(table);
      }
    ),
    // Faculty table - stores all the available Faculties in the institution
    await knex.schema.createTable(
      TableNames.faculties,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, `${TableNames.Campuses}`);
        addDefaultColumns(table);
      }
    ),
    // Password-Resets table
    await knex.schema.createTable(
      TableNames.passwordResets,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("email").notNullable();
        table.string("token").notNullable();
        addDefaultColumns(table);
      }
    ),
    // Event-logs table
    await knex.schema.createTable(
      TableNames.eventLogs,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("event").notNullable();
        table.string("eventType").notNullable();
        table.string("user").notNullable();
        table.string("time").defaultTo(Date.now());
        addDefaultColumns(table);
      }
    ),
    // Mentor-ship Request table
    await knex.schema.createTable(
      TableNames.Mentorship_requests,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("types").notNullable();
        table.string("expectations").notNullable();
        table.string("goals").notNullable();
        table.boolean("acceptance").notNullable();
        table.string("status").notNullable();
        table.string("time").defaultTo(Date.now());
        createRef(table, `${TableNames.User}`);
        addDefaultColumns(table);
      }
    ),
    // Messages table
    await knex.schema.createTable(
      TableNames.Message,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("message").notNullable();
        table.string("sender_id").notNullable();
        table.string("size").notNullable();
        table.boolean("title").notNullable();
        table.string("thumb").notNullable();
        table.string("type").notNullable();
        table.string("imageName").notNullable();
        table.string("url").notNullable();
        table.string("reply").notNullable();
        table.string("caption").notNullable();
        table.string("channel").notNullable();
        table.string("status").notNullable();
        table.string("time").defaultTo(Date.now());
        createRef(table, `${TableNames.User}`);
        addDefaultColumns(table);
      }
    ),
    // Sub_Sub_Categories table
    await knex.schema.createTable(
      TableNames.Sub_Sub_Categotries,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        createRef(table, `${TableNames.Sub_Categories}`);
        addDefaultColumns(table);
      }
    ),
    // Data_Types table
    await knex.schema.createTable(
      TableNames.Data_types,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("type").notNullable();
        addDefaultColumns(table);
      }
    ),
    // Groups table
    await knex.schema.createTable(
      TableNames.Groups,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("title").notNullable();
        table.boolean("visibility").notNullable();
        table.string("image").notNullable();
        table.string("status").notNullable();
        addDefaultColumns(table);
      }
    ),
    //Contacts table
    await knex.schema.createTable(
      TableNames.Contacts,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.string("phone").notNullable();
        createRef(table, `${TableNames.Campuses}`);
        addDefaultColumns(table);
      }
    ),
    //Map_Locations table
    await knex.schema.createTable(
      TableNames.Map_Locations,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("longitude").notNullable();
        table.string("latitude").notNullable();
        table.string("phone").notNullable();
        createRef(table, `${TableNames.Campuses}`);
        addDefaultColumns(table);
      }
    ),
    //Contents table
    await knex.schema.createTable(
      TableNames.Contents,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("content").notNullable();
        table.string("path").notNullable();
        createRef(table, `${TableNames.Data_types}`);
        createRef(table, `${TableNames.Sub_Categories}`);
        createRef(table, `${TableNames.Admin_Users}`);
        addDefaultColumns(table);
      }
    ),
    // news  Categories table - stores all the available content categories
    await knex.schema.createTable(
      TableNames.NewsCategories,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("name").notNullable();
        addDefaultColumns(table);
      }
    ),
    //news table
    await knex.schema.createTable(
      TableNames.News,
      (table: Knex.CreateTableBuilder) => {
        table.increments("_id").notNullable().primary();
        table.string("title").notNullable();
        table.string("content").notNullable();
        table.string("image").notNullable();
        createRef(table, `${TableNames.NewsCategories}`);
        createRef(table, `${TableNames.Admin_Users}`);
        table.string("status").notNullable();
        addDefaultColumns(table);
      }
    ),
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await Promise.all(
    orderedTables.map(async (tableName: string) =>
      knex.schema.dropTableIfExists(tableName)
    )
  );
}
