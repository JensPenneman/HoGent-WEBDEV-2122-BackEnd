const uuid             = require("uuid");
const {
		  tables,
		  getKnex,
	  }                = require("../data");
const {getChildLogger} = require("../core/logging");

const formatBestuurslid_Bestuurstaak = ({
											id,
											bestuurslid_id,
											bestuurslid_firstName,
											bestuurslid_lastName,
											bestuurslid_mail,
											bestuurstaak_id,
											bestuurstaak_name,
											bestuurstaak_description,
											bestuurstaak_isSiteAdmin,
										}) => ({
	id:           id,
	bestuurslid:  {
		id:        bestuurslid_id,
		firstName: bestuurslid_firstName,
		lastName:  bestuurslid_lastName,
		mail:      bestuurslid_mail,
	},
	bestuurstaak: {
		id:          bestuurstaak_id,
		name:        bestuurstaak_name,
		description: bestuurstaak_description,
		isSiteAdmin: bestuurstaak_isSiteAdmin,
	},
});

const findAll = async ({
						   limit,
						   offset,
					   }) => {
	const bestuur_bestuurstaken = await getKnex()(tables.bestuurslid_bestuurstaak)
		.select([`${tables.bestuurslid_bestuurstaak}.id`, "id_bestuurslid", "id_bestuurstaak", `${tables.bestuurslid}.id as bestuurslid_id`, `${tables.bestuurslid}.firstName as bestuurslid_firstName`, `${tables.bestuurslid}.lastName as bestuurslid_lastName`, `${tables.bestuurslid}.mail as bestuurslid_mail`, `${tables.bestuurstaak}.id as bestuurstaak_id`, `${tables.bestuurstaak}.name as bestuurstaak_name`, `${tables.bestuurstaak}.description as bestuurstaak_description`, `${tables.bestuurstaak}.isSiteAdmin as bestuurstaak_isSiteAdmin`])
		.join(tables.bestuurslid, `${tables.bestuurslid_bestuurstaak}.id_bestuurslid`, "=", `${tables.bestuurslid}.id`)
		.join(tables.bestuurstaak, `${tables.bestuurslid_bestuurstaak}.id_bestuurstaak`, "=", `${tables.bestuurstaak}.id`)
		.limit(limit)
		.offset(offset)
		.orderBy("bestuurslid_firstName", "asc");

	return bestuur_bestuurstaken.map(formatBestuurslid_Bestuurstaak);
};

const findCount = async () => {
	const [count] = await getKnex()(tables.bestuurslid_bestuurstaak)
		.count();
	return count["count(*)"];
};

const findById = async (id) => {
	const bestuurslid_bestuurstaak = await getKnex()(tables.bestuurslid_bestuurstaak)
		.first([`${tables.bestuurslid_bestuurstaak}.id`, "id_bestuurslid", "id_bestuurstaak", `${tables.bestuurslid}.id as bestuurslid_id`, `${tables.bestuurslid}.firstName as bestuurslid_firstName`, `${tables.bestuurslid}.lastName as bestuurslid_lastName`, `${tables.bestuurslid}.mail as bestuurslid_mail`, `${tables.bestuurstaak}.id as bestuurstaak_id`, `${tables.bestuurstaak}.name as bestuurstaak_name`, `${tables.bestuurstaak}.description as bestuurstaak_description`, `${tables.bestuurstaak}.isSiteAdmin as bestuurstaak_isSiteAdmin`])
		.where(`${tables.bestuurslid_bestuurstaak}.id`, id)
		.join(tables.bestuurslid, `${tables.bestuurslid_bestuurstaak}.id_bestuurslid`, "=", `${tables.bestuurslid}.id`)
		.join(tables.bestuurstaak, `${tables.bestuurslid_bestuurstaak}.id_bestuurstaak`, "=", `${tables.bestuurstaak}.id`);

	return bestuurslid_bestuurstaak && formatBestuurslid_Bestuurstaak(bestuurslid_bestuurstaak);
};

const create = async ({
						  bestuurslid_id,
						  bestuurstaak_id,
					  }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.bestuurslid_bestuurstaak)
			.insert({
						id,
						id_bestuurslid:  bestuurslid_id,
						id_bestuurstaak: bestuurstaak_id,
					});
		return await findById(id);
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid_bestuurstaak-repository");
		logger.error("Error in create", {error});
		throw error;
	}
};

const updateById = async (id, {
	bestuurslid_id,
	bestuurstaak_id,
}) => {
	try {
		await getKnex()(tables.bestuurslid_bestuurstaak)
			.update({
						id_bestuurslid:  bestuurslid_id,
						id_bestuurstaak: bestuurstaak_id,
					})
			.where(`${tables.bestuurslid_bestuurstaak}`, id);
		return await findById(id);
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid_bestuurstaak-repository");
		logger.error("Error in updateById", {error});
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowsAffected = await getKnex()(tables.bestuurslid_bestuurstaak)
			.delete()
			.where(`${tables.bestuurslid_bestuurstaak}.id`, id);
		return rowsAffected > 0;
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid_bestuurstaak-repository");
		logger.error("Error in deleteById", {error});
		throw error;
	}
};

module.exports = {
	findAll,
	findCount,
	findById,
	create,
	updateById,
	deleteById,
};