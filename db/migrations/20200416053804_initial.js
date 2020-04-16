const knex = require('knex');
const tableNames = require('../../app/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true); // use the datetime type and default to now.
  table.datetime('deleted_at');
}

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    table.string('email', 254).notNullable().unique();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('password', 127).notNullable();
    table.string('phone', 15).nullable();
    table.datetime('last_login');
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.user);
};
