const {getChildLogger} = require("../core/logging");

const bestuurstaakRepository = require("../repository/bestuurstaak");
const ServiceError           = require("../core/serviceError");

const NODE_ENV                  = process.env.NODE_ENV;
const CONFIG                    = require("../../config/" + NODE_ENV);
const DEFAULT_PAGINATION_LIMIT  = CONFIG.defaultPagination.limit;
const DEFAULT_PAGINATION_OFFSET = CONFIG.defaultPagination.offset;

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger("bestuurstaak-service");
	this.logger.debug(message, meta);
};

const getAll = async (limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) => {
	debugLog("Fetching bestuurstaken", {
		limit,
		offset,
	});
	const data       = await bestuurstaakRepository.findAll({
																limit,
																offset,
															});
	const totalCount = await bestuurstaakRepository.findCount();
	return {
		data,
		count: totalCount,
		limit,
		offset,
	};
};


const getById = (id) => {
	debugLog(`Fetching bestuurstaak with id ${id}`);

	const bestuurstaak = bestuurstaakRepository.findById(id);
	if (!bestuurstaak) {
		throw ServiceError.notFound(`There is no bestuurstaak with id ${id}`);
	}

	return bestuurstaak;
};

const create = ({
					name,
					description,
					isSiteAdmin,
				}) => {
	const newBestuurstaak = {
		name,
		description,
		isSiteAdmin,
	};

	debugLog("Creating new bestuurstaak", newBestuurstaak);

	return bestuurstaakRepository.create(newBestuurstaak);
};

const updateById = (id, {
	name,
	description,
	isSiteAdmin,
}) => {
	const updatedBestuurstaak = {
		name,
		description,
		isSiteAdmin,
	};

	debugLog(`Updating bestuurstaak with id ${id}`, updatedBestuurstaak);

	return bestuurstaakRepository.updateById(id, updatedBestuurstaak);
};

const deleteById = async (id) => {
	debugLog(`Deleting bestuurstaak with id ${id}`);

	await bestuurstaakRepository.deleteById(id);
};


module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};