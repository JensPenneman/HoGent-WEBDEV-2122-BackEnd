const argon2 = require("argon2");

const NODE_ENV = process.env.NODE_ENV;
const CONFIG   = require("../../config/" + NODE_ENV);

const ARGON_SALT_LENGTH = CONFIG.auth.argon.saltLength;
const ARGON_HASH_LENGTH = CONFIG.auth.argon.hashLength;
const ARGON_TIME_COST   = CONFIG.auth.argon.timeCost;
const ARGON_MEMORY_COST = CONFIG.auth.argon.memoryCost;

module.exports.hashPassword = async (password) => {
	return await argon2.hash(
		password,
		{
			type:       argon2.argon2id,
			saltLength: ARGON_SALT_LENGTH,
			hashLength: ARGON_HASH_LENGTH,
			timeCost:   ARGON_TIME_COST,
			memoryCost: ARGON_MEMORY_COST,
		},
	);
};

module.exports.verifyPassword = async (password, passwordHash) => {
	return await argon2.verify(
		passwordHash,
		password,
		{
			type:       argon2.argon2id,
			saltLength: ARGON_SALT_LENGTH,
			hashLength: ARGON_HASH_LENGTH,
			timeCost:   ARGON_TIME_COST,
			memoryCost: ARGON_MEMORY_COST,
		},
	);
};