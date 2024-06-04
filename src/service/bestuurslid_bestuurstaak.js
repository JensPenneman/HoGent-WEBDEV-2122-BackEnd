const {getChildLogger} = require("../core/logging");

const bestuurslid_bestuurstaakRepository = require("../repository/bestuurslid_bestuurstaak");

const NODE_ENV                  = process.env.NODE_ENV;
const CONFIG                    = require("../../config/" + NODE_ENV);
const DEFAULT_PAGINATION_LIMIT  = CONFIG.defaultPagination.limit;
const DEFAULT_PAGINATION_OFFSET = CONFIG.defaultPagination.offset;

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger("bestuurslid_bestuurstaak-service");
	this.logger.debug(message, meta);
};


const getAll = async (limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) => {
	debugLog("Fetching all bestuur_bestuurstaken", {
		limit,
		offset,
	});

	const data  = await bestuurslid_bestuurstaakRepository.findAll({
																	   limit,
																	   offset,
																   });
	const count = await bestuurslid_bestuurstaakRepository.findCount();

	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = async (id) => {
	debugLog(`Fetching bestuurslid_bestuurstaak with id ${id}`);

	const bestuurslid_bestuurstaak = await bestuurslid_bestuurstaakRepository.findById(id);
	if (!bestuurslid_bestuurstaak) {
		throw new Error(`There is no bestuurslid_bestuurstaak with id ${id}`);
	}

	return bestuurslid_bestuurstaak;
};

const create = async ({
						  bestuurslid_id,
						  bestuurstaak_id,
					  }) => {
	debugLog("Creating new bestuurslid_bestuurstaak", {
		bestuurslid_id,
		bestuurstaak_id,
	});

	const newBestuurslidBestuurstaak = {
		bestuurslid_id,
		bestuurstaak_id,
	};

	return bestuurslid_bestuurstaakRepository.create(newBestuurslidBestuurstaak);
};

const updateById = async (id, {
	bestuurslid_id,
	bestuurstaak_id,
}) => {
	debugLog(`Updating bestuurslid_bestuurstaak with id ${id}`, {
		bestuurslid_id,
		bestuurstaak_id,
	});

	const updatetedBestuurslidBestuurstaak = {
		bestuurslid_id,
		bestuurstaak_id,
	};

	return bestuurslid_bestuurstaakRepository.updateById(id, updatetedBestuurslidBestuurstaak);
};

const deleteById = async (id) => {
	debugLog(`Deleting bestuurslid_bestuurstaak with id ${id}`);
	await bestuurslid_bestuurstaakRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};