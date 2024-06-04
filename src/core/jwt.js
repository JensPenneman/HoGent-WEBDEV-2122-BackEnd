const jwt = require("jsonwebtoken");

const ServiceError = require("./serviceError");

const NODE_ENV = process.env.NODE_ENV;
const CONFIG   = require("../../config/" + NODE_ENV);

const JWT_AUDIENCE            = CONFIG.auth.jwt.audience;
const JWT_SECRET              = CONFIG.auth.jwt.secret;
const JWT_ISSUER              = CONFIG.auth.jwt.issuer;
const JWT_EXPIRATION_INTERVAL = CONFIG.auth.jwt.expirationInterval;

module.exports.generateJWT = (bestuurslid) => {
	const tokenData = {
		bestuurslidId:   bestuurslid.id,
		bestuurstaken: bestuurslid.bestuurstaken,
	};

	const signOptions = {
		expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
		audience:  JWT_AUDIENCE,
		issuer:    JWT_ISSUER,
		subject:   "auth",
	};

	return new Promise((resolve, reject) => {
		jwt.sign(tokenData, JWT_SECRET, signOptions, (error, token) => {
			if (error) {
				console.log("Error while signing new token:", error.message);
				return reject(error);
			}
			return resolve(token);
		});
	});
};


module.exports.verifyJWT = (authToken) => {
	const verifyOptions = {
		audience: JWT_AUDIENCE,
		issuer:   JWT_ISSUER,
		subject:  "auth",
	};

	return new Promise((resolve, reject) => {
		jwt.verify(authToken, JWT_SECRET, verifyOptions, (error, decodedToken) => {
			if (error || !decodedToken) {
				console.log("Error while verifying token:", error.message);
				return reject(error || ServiceError.unauthorized("Token could not be parsed"));
			}
			return resolve(decodedToken);
		});
	});
};
