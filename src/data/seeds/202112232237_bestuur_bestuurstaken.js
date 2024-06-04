const {tables}                = require("..");
const {BESTUUR_BESTUURSTAKEN} = require("../mockdata");

module.exports = {
	seed: async (knex) => {
		await knex(tables.bestuurslid_bestuurstaak).delete();

		await knex(tables.bestuurslid_bestuurstaak).insert(BESTUUR_BESTUURSTAKEN);
	},
};