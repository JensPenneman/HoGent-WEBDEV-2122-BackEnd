const uuid             = require("uuid");
const {
		  tables,
		  getKnex,
	  }                = require("../data");
const {getChildLogger} = require("../core/logging");

const findAll = ({
					 limit,
					 offset,
				 }) => {
	return getKnex()(tables.bestuurstaak)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "asc");
};

const findCount = async () => {
	const [count] = await getKnex()(tables.bestuurstaak).count();
	return count["count(*)"];
};

const findById = (id) => {
	return getKnex()(tables.bestuurstaak)
		.where("id", id)
		.first();
};

const create = async ({
						  name,
						  description,
						  isSiteAdmin,
					  }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.bestuurstaak)
			.insert({
						id,
						name,
						description,
						isSiteAdmin,
					});
		return await findById(id);
	}
	catch (error) {
		const logger = getChildLogger("bestuurstaak-repository");
		logger.error("Error in create", {error});
		throw error;
	}
};

const updateById = async (id, {
	name,
	description,
	isSiteAdmin,
}) => {
	try {
		await getKnex()(tables.bestuurstaak)
			.update({
						name,
						description,
						isSiteAdmin,
					})
			.where(`${tables.bestuurstaak}.id`, id);
		return await findById(id);
	}
	catch (error) {
		const logger = getChildLogger("bestuurstaak-repository");
		logger.error("Error in updateById", {error});
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowsAffected = await getKnex()(tables.bestuurstaak)
			.delete()
			.where(`${tables.bestuurstaak}.id`, id);
		return rowsAffected > 0;
	}
	catch (error) {
		const logger = getChildLogger("bestuurstaak-repository");
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