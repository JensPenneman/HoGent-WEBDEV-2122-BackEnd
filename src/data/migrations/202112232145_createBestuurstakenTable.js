const {tables} = require("..");

module.exports = {
	up:   async (knex) => {
		await knex.schema.createTable(tables.bestuurstaak, (table) => {
			table.uuid("id").primary();
			table.string("name", 255).notNullable();
			table.string("description", 255).notNullable();
			table.boolean("isSiteAdmin").notNullable();

			table.unique("name", "idx_bestuurstaak_name_unique");
		});
	},
	down: (knex) => {
		return knex.schema.dropTableIfExists(tables.bestuurstaak);
	},
};