const {tables} = require("..");

module.exports = {
	up:   async (knex) => {
		await knex.schema.createTable(tables.bestuurslid_bestuurstaak, (table) => {
			table.uuid("id").primary();
			table.string("id_bestuurslid", 255).notNullable();
			table.string("id_bestuurstaak", 255).notNullable();

			table.foreign("id_bestuurslid", "fk_bestuurslid_bestuurstaak_bestuurstaak")
				 .references(`${tables.bestuurslid}.id`)
				 .onDelete("CASCADE");
			table.foreign("id_bestuurstaak", "fk_bestuurslid_bestuurstaak_bestuurslid")
				 .references(`${tables.bestuurstaak}.id`)
				 .onDelete("CASCADE");
		});
	},
	down: (knex) => {
		return knex.schema.dropTableIfExists(tables.bestuurslid_bestuurstaak);
	},
};