const {getChildLogger}                   = require("../core/logging");
const {
		  hashPassword,
		  verifyPassword,
	  }                                  = require("../core/password");
const {
		  generateJWT,
		  verifyJWT,
	  }                                  = require("../core/jwt");
const ServiceError                       = require("../core/serviceError");
const bestuurslidRepository              = require("../repository/bestuurslid");
const bestuurslid_bestuurstaakRepository = require("../repository/bestuurslid_bestuurstaak");

const NODE_ENV                  = process.env.NODE_ENV;
const CONFIG                    = require("../../config/" + NODE_ENV);
const DEFAULT_PAGINATION_LIMIT  = CONFIG.defaultPagination.limit;
const DEFAULT_PAGINATION_OFFSET = CONFIG.defaultPagination.offset;

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger("bestuurslid-service");
	this.logger.debug(message, meta);
};


const makeExposedBestuurslid = ({
									id,
									firstName,
									lastName,
									mail,
								}) => ({
	id,
	firstName,
	lastName,
	mail,
});

const makeLoginData = async (bestuurslid) => {
	const token = await generateJWT(bestuurslid);
	return {
		bestuurslid: makeExposedBestuurslid(bestuurslid),
		token,
	};
};

const login = async (mail, password) => {
	const bestuurslid = await bestuurslidRepository.findByMail(mail);
	if (!bestuurslid) {
		throw ServiceError.unauthorized("The given mail does not match!");
	}

	const isValidPasswoord = await verifyPassword(password, bestuurslid.passwordHash);
	if (!isValidPasswoord) {
		throw ServiceError.unauthorized("The given password does not match!");
	}

	bestuurslid.bestuurstaken = await bestuurslid_bestuurstaakRepository
		.findAll(300, 0);
	bestuurslid.bestuurstaken = bestuurslid.bestuurstaken
										   .filter((bestuurslid_bestuurstaak) => {
											   return bestuurslid.id === bestuurslid_bestuurstaak.bestuurslid.id;
										   })
										   .map((bestuurslid_bestuurstaak) => {
											   return bestuurslid_bestuurstaak.bestuurstaak.id;
										   });

	return await makeLoginData(bestuurslid);
};

const getAll = async (limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) => {
	debugLog("Fetching bestuur", {
		limit,
		offset,
	});
	const data       = await bestuurslidRepository.findAll({
															   limit,
															   offset,
														   });
	const totalCount = await bestuurslidRepository.findCount();
	return {
		data:  data.map(makeExposedBestuurslid),
		count: totalCount,
		limit,
		offset,
	};
};

const getById = async (id) => {
	debugLog(`Fetching bestuurslid with id ${id}`);
	const bestuurslid = await bestuurslidRepository.findById(id);

	if (!bestuurslid) {
		throw ServiceError.notFound(`No bestuurslid with id ${id} exists`, {id});
	}

	return makeExposedBestuurslid(bestuurslid);
};

const register = async ({
							firstName,
							lastName,
							password,
						}) => {
	debugLog("Creating a new bestuurslid", {
		firstName,
		lastName,
	});
	const passwordHash = await hashPassword(password);

	const bestuurslid = await bestuurslidRepository.create({
															   firstName,
															   lastName,
															   passwordHash,
														   });

	bestuurslid.bestuurstaken = await bestuurslid_bestuurstaakRepository
		.findAll({
					 limit:300,
					 offset:0,
				 });
	bestuurslid.bestuurstaken = bestuurslid.bestuurstaken
										   .filter((bestuurslid_bestuurstaak) => {
											   return bestuurslid.id === bestuurslid_bestuurstaak.bestuurslid.id;
										   })
										   .map((bestuurslid_bestuurstaak) => {
											   return bestuurslid_bestuurstaak.bestuurstaak.id;
										   });

	return await makeLoginData(bestuurslid);
};

const updateById = (id, {
	firstName,
	lastName,
}) => {
	debugLog(`Updating bestuurslid with id ${id}`, {
		firstName,
		lastName,
	});
	const bestuurslid = bestuurslidRepository.updateById(id, {
		firstName,
		lastName,
	});
	return makeExposedBestuurslid(bestuurslid);
};

const deleteById = async (id) => {
	debugLog(`Deleting bestuurslid with id ${id}`);
	const deleted = await bestuurslidRepository.deleteById(id);

	if (!deleted) {
		throw ServiceError.notFound(`No bestuurslid with id ${id} exists`, {id});
	}
};

const checkAndParseSession = async (authHeader) => {
	if (!authHeader) {
		throw ServiceError.unauthorized("You need to be signed in");
	}
	if (!authHeader.startsWith("Bearer ")) {
		throw ServiceError.unauthorized("Invalid authentication token");
	}

	const authToken = authHeader.substr(7);
	try {
		const {
				  bestuurstaken,
				  bestuurslidId,
			  } = await verifyJWT(authToken);
		return {
			bestuurslidId,
			bestuurstaken,
			authToken,
		};
	}
	catch (error) {
		const logger = getChildLogger("bestuurslid-service");
		logger.error(error.message, {error});
		throw ServiceError.unauthorized(error.message);
	}
};

const checkBestuurstaak = (bestuurstakenVanBestuurslid, bestuurstaken) => {
	let hasPermission = false;
	bestuurstaken.forEach((bestuurstaak) => {
		if (bestuurstakenVanBestuurslid.includes(bestuurstaak)) {
			hasPermission = true;
		}
	});
	if (!hasPermission) {
		throw ServiceError.forbidden("You are not allowed to view this part of the application");
	}
};

module.exports = {
	login,
	register,
	getAll,
	getById,
	updateById,
	deleteById,
	checkAndParseSession,
	checkBestuurstaak,
};