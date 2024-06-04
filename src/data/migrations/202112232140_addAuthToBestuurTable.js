const {tables} = require("..");

module.exports = {
	up:   async (knex) => {
		await knex.schema.alterTable(tables.bestuurslid, (table) => {
			table.string("mail").notNullable();
			table.string("passwordHash").notNullable();

			table.unique("mail", "idx_bestuurslid_mail_unique");
		});
	},
	down: (knex) => {
		return knex.schema.alterTable(tables.bestuurslid, (table) => {
			table.dropColumns("mail", "passwordHash");
		});
	},
};