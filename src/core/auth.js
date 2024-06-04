const bestuurslidService = require("../service/bestuurslid");

const requireAuthentication = async (ctx, next) => {
	const {authorization} = ctx.headers;
	const {
			  authToken,
			  ...session
		  }               = await bestuurslidService.checkAndParseSession(authorization);
	ctx.state.session     = session;
	ctx.state.authToken   = authToken;
	return next();
};

const makeRequireBestuurstaak = (bestuurstakenVanBestuurslid) => async (ctx, next) => {
	const {bestuurstaken = []} = ctx.state.session;
	bestuurslidService.checkBestuurstaak(bestuurstakenVanBestuurslid, bestuurstaken);
	return next();
};

module.exports = {
	requireAuthentication,
	makeRequireBestuurstaak,
};