const {tables}  = require("..");
const {BESTUUR} = require("../mockdata");

module.exports = {
	seed: async (knex) => {
		await knex(tables.bestuurslid).delete();

		await knex(tables.bestuurslid).insert(BESTUUR);
	},
};