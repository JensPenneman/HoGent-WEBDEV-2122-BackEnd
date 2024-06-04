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
	return getKnex()(tables.bestuurslid)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("firstName", "asc");
};

const findCount = async () => {
	const [count] = await getKnex()(tables.bestuurslid).count();
	return count["count(*)"];
};

const findById = (id) => {
	return getKnex()(tables.bestuurslid)
		.where("id", id)
		.first();
};

const findByMail = (mail) => {
	return getKnex()(tables.bestuurslid)
		.where("mail", mail)
		.first();
};

const create = async ({
						  firstName,
						  lastName,
						  passwordHash,
					  }) => {
	try {
		const id   = uuid.v4();
		const mail = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(" ", ".")}@kljstekene.be`;
		await getKnex()(tables.bestuurslid)
			.insert({
						id,
						firstName,
						lastName,
						mail,
						passwordHash,
					});
		return await findById(id);
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid-repository");
		logger.error("Error in create", {error});
		throw error;
	}
};

const updateById = async (id, {
	firstName,
	lastName,
}) => {
	try {
		const mail = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(" ", ".")}@kljstekene.be`;
		await getKnex()(tables.bestuurslid)
			.update({
						firstName,
						lastName,
						mail,
					})
			.where("id", id);
		return await findById(id);
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid-repository");
		logger.error("Error in updateById", {
			error,
		});
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowsAffected = await getKnex()(tables.bestuurslid)
			.delete()
			.where("id", id);
		return rowsAffected > 0;
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid-repository");
		logger.error("Error in deleteById", {
			error,
		});
		throw error;
	}
};

module.exports = {
	findAll,
	findCount,
	findById,
	findByMail,
	create,
	updateById,
	deleteById,
};