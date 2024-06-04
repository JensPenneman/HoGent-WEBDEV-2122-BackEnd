const Koa        = require("koa");
const koaCors    = require("@koa/cors");
const bodyParser = require("koa-bodyparser");

const installRest  = require("./rest");
const ServiceError = require("./core/serviceError");
const {
		  initializeLogger,
		  getLogger,
	  }            = require("./core/logging");
const {
		  initializeData,
		  shutdownData,
	  }            = require("./data");

const NODE_ENV     = process.env.NODE_ENV;
const CONFIG       = require("../config/" + NODE_ENV);
const CORS_ORIGINS = CONFIG.CORS.origins;
const CORS_MAX_AGE = CONFIG.CORS.maxAge;

const LOG_LEVEL    = CONFIG.log.level;
const LOG_DISABLED = CONFIG.log.disabled;

const SERVER_PORT = CONFIG.server.port;

const swaggerJsdoc   = require("swagger-jsdoc");
const {koaSwagger}   = require("koa2-swagger-ui");
const swaggerOptions = require("../swagger.config.js");

module.exports = async function createServer() {
	initializeLogger({
						 level:        LOG_LEVEL,
						 disabled:     LOG_DISABLED,
						 isProduction: NODE_ENV === "production",
						 defaultMeta:  {NODE_ENV},
					 });

	await initializeData();

	const app = new Koa();

	app.use(koaCors({
						origin:       (ctx) => {
							if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
								return ctx.request.header.origin;
							}
							return CORS_ORIGINS[0];
						},
						allowHeaders: ["Accept", "Content-Type", "Authorization"],
						maxAge:       CORS_MAX_AGE,
					}));
	app.use(bodyParser());

	const spec = swaggerJsdoc(swaggerOptions);
	app.use(
		koaSwagger({
					   routePrefix:    "/swagger", // host at /swagger instead of default /docs
					   specPrefix:     "/swagger/spec", // route where the spec is returned
					   exposeSpec:     true, // expose spec file
					   swaggerOptions: {  // passed to SwaggerUi()
						   spec,
					   },
				   }),
	);

	app.use(async (ctx, next) => {
		const logger = getLogger();
		logger.info(`>> ${ctx.method} ${ctx.url}`);

		try {
			await next();
			logger.info(`>> ${ctx.method} ${ctx.status} ${ctx.url}`);
		}
		catch (error) {
			logger.error(`!! ${ctx.method} ${ctx.status} ${ctx.url}`, {error});
			throw error;
		}
	});
	app.use(async (ctx, next) => {
		try {
			await next();

			if (ctx.status === 404) {
				ctx.body = {
					code:    "NOT_FOUND",
					message: `Unknown resource: ${ctx.url}`,
				};
			}
		}
		catch (error) {
			const logger = getLogger();
			logger.error("Error occurred while handling a request", {error});

			let statusCode = error.status || 500;
			let errorBody  = {
				code:    error.code || "INTERNAL_SERVER_ERROR",
				message: error.message,
				details: error.details || {},
				stack:   NODE_ENV !== "production" ? error.stack : undefined,
			};

			if (error instanceof ServiceError) {
				if (error.isNotFound) {
					statusCode = 404;
				}
				if (error.isValidationFailed) {
					statusCode = 400;
				}
				if (error.isUnauthorized) {
					statusCode = 401;
				}
				if (error.isForbidden) {
					statusCode = 403;
				}
			}

			ctx.status = statusCode;
			ctx.body   = errorBody;
		}
	});

	installRest(app);

	return {
		getApp() {
			return app;
		},

		start() {
			return new Promise((resolve) => {
				const PORT = process.env.PORT || SERVER_PORT;
				app.listen(PORT);
				getLogger().info(`Server listening on http://localhost:${PORT}`);
				resolve();
			});
		},

		async stop() {
			app.removeAllListeners();
			await shutdownData();
			getLogger().info("Goodbye");
		},
	};
};