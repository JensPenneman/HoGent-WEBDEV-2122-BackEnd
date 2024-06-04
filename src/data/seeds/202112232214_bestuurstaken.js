const {tables}        = require("..");
const {BESTUURSTAKEN} = require("../mockdata");

module.exports = {
	seed: async (knex) => {
		await knex(tables.bestuurstaak).delete();

		await knex(tables.bestuurstaak).insert(BESTUURSTAKEN);
	},
};