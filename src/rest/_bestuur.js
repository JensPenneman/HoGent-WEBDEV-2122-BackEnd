const Joi    = require("joi");
const Router = require("@koa/router");

const bestuurslidService  = require("../service/bestuurslid");
const bestuurstaakService = require("../service/bestuurstaak");
const {
		  requireAuthentication,
		  makeRequireBestuurstaak,
	  }                   = require("../core/auth");
const validate            = require("./_validation");

const login            = async (ctx) => {
	const {
			  mail,
			  password,
		  }  = ctx.request.body;
	ctx.body = await bestuurslidService.login(mail, password);
};
login.validationScheme = {
	body: {
		mail:     Joi.string().email(),
		password: Joi.string(),
	},
};

const register            = async (ctx) => {
	ctx.body   = await bestuurslidService.register({...ctx.request.body});
	ctx.status = 201;
};
register.validationScheme = {
	body: {
		firstName: Joi.string().max(255),
		lastName:  Joi.string().max(255),
		password:  Joi.string().min(8).max(32),
	},
};

const getAllBestuur            = async (ctx) => {
	ctx.body = await bestuurslidService.getAll(ctx.query.limit && Number(ctx.query.limit), ctx.query.offset && Number(ctx.query.offset));
};
getAllBestuur.validationScheme = {
	query: Joi.object({
						  limit:  Joi.number().integer().positive().max(1000).optional(),
						  offset: Joi.number().integer().min(0).optional(),
					  }).and("limit", "offset"),
};

const getBestuurslidById            = async (ctx) => {
	ctx.body = await bestuurslidService.getById(ctx.params.id);
};
getBestuurslidById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateBestuurslid            = async (ctx) => {
	ctx.body = await bestuurslidService.updateById(ctx.params.id, ctx.request.body);
};
updateBestuurslid.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body:   {
		firstName: Joi.string().max(255),
		lastName:  Joi.string().max(255),
	},
};

const deleteBestuurslid            = async (ctx) => {
	await bestuurslidService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteBestuurslid.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = async function installBestuurRoutes(app) {
	const router = new Router({
								  prefix: "/bestuur",
							  });

	let siteAdmins     = await bestuurstaakService.getAll(300, 0);
	siteAdmins         = siteAdmins.data
								   .filter((bestuurstaak) => {
									   return bestuurstaak.isSiteAdmin;
								   })
								   .map((bestuurstaak) => {
									   return bestuurstaak.id;
								   });
	const requireAdmin = makeRequireBestuurstaak(siteAdmins);
	router.post("/login", validate(login.validationScheme), login);
	router.post("/register", requireAuthentication, requireAdmin, validate(register.validationScheme), register);
	router.get("/", validate(getAllBestuur.validationScheme), getAllBestuur);
	router.get("/:id", validate(getBestuurslidById.validationScheme), getBestuurslidById);
	router.put("/:id", requireAuthentication, validate(updateBestuurslid.validationScheme), updateBestuurslid);
	router.delete("/:id", requireAuthentication, requireAdmin, validate(deleteBestuurslid.validationScheme), deleteBestuurslid);

	app.use(router.routes()).use(router.allowedMethods());
};



/**
 * @swagger
 * tags:
 *   name: Bestuur
 *   description: Everything that has to do with people and accounts
 * components:
 *   schemas:
 *     Login:
 *       allOf:
 *         - type: object
 *           required:
 *             - mail
 *             - password
 *           properties:
 *             mail:
 *               type: "string"
 *             password:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Login"
 *     Register:
 *       allOf:
 *         - type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - password
 *           properties:
 *             firstName:
 *               type: "string"
 *             lastName:
 *               type: "string"
 *             password:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Register"
 *     BestuurList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BestuurSafe"
 *   examples:
 *     Login:
 *       bestuurslid:
 *         id: "aa4f4f89-904c-4ddd-878b-224018e65926"
 *         firstName: "Jarno"
 *         lastName: "Schepens"
 *         mail: "jarno.schepens@kljstekene.be"
 *       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiZXN0dXVyc2xpZElkIjoiYWE0ZjRmODktOTA0Yy00ZGRkLTg3OGItMjI0MDE4ZTY1OTI2IiwiYmVzdHV1cnN0YWtlbiI6WyI3YTAwOWFiMS00ZDllLTQyMTYtOGE4NC0wZGQ2NWFmMjIwMGUiXSwiaWF0IjoxNjQwMTcxNzA3LCJleHAiOjE2NDAxNzUzMDcsImF1ZCI6IjA3NDU5MWpwLmNsb3VkbnMucGgiLCJpc3MiOiIwNzQ1OTFqcC5jbG91ZG5zLnBoIiwic3ViIjoiYXV0aCJ9.vp1eNtE5-aN35jGDIQPLxDOQbV4xKn0ERjUylqLfiaQ"
 *     Register:
 *       bestuurslid:
 *         id: "b3fe6ca3-bbd6-470c-9c55-108b691a3457"
 *         firstName: "Jens"
 *         lastName: "Penneman"
 *         mail: "jens.penneman@kljstekene.be"
 *       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiZXN0dXVyc2xpZElkIjoiYjNmZTZjYTMtYmJkNi00NzBjLTljNTUtMTA4YjY5MWEzNDU3IiwiYmVzdHV1cnN0YWtlbiI6W10sImlhdCI6MTY0MDI2MTE1NiwiZXhwIjoxNjQwMjY0NzU2LCJhdWQiOiIwNzQ1OTFqcC5jbG91ZG5zLnBoIiwiaXNzIjoiMDc0NTkxanAuY2xvdWRucy5waCIsInN1YiI6ImF1dGgifQ.O6hHWJCBWn4RPQKk4mIn--kknPWqEPbPj4JhZnNmOqk"
 *   requestBodies:
 *     Login:
 *       description: The credentials to login.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: "string"
 *                 example: "jarno.schepens@kljstekene.be"
 *               password:
 *                 type: "string"
 *                 example: "12345678"
 *     Register:
 *       description: The credentials to register.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: "string"
 *                 example: "Jens"
 *               lastName:
 *                 type: "string"
 *                 example: "Penneman"
 *               password:
 *                 type: "string"
 *                 example: "12345678"
 *     Bestuurslid:
 *       description: The credentials to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: "string"
 *                 example: "Jef"
 *               lastName:
 *                 type: "string"
 *                 example: "Bakker"
 *   responses:
 *     404NotFound:
 *       description: The request resource could not to be found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: "string"
 *               details:
 *                 type: "application/json"
 *                 description: "extra info for the not found"
 *               stack:
 *                 type: "string"
 *                 description: "Stack trace"
 *             example:
 *               code: "NOT_FOUND"
 *               message: "No bestuurslid with id aa4f4f89-904c-4ddd-878b-224018e65923 exists"
 *               details:
 *                 id: "aa4f4f89-904c-4ddd-878b-224018e65923"
 *               stack: "ServiceError: No bestuurslid with id aa4f4f89-904c-4ddd-878b-224018e65923 exists\n    at Function.notFound (D:\\SERVERS\\kljstekenebackendmetauth\\src\\core\\serviceError.js:31:10)\n    at Object.getById (D:\\SERVERS\\kljstekenebackendmetauth\\src\\service\\bestuurslid.js:93:22)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at async getBestuurslidById (D:\\SERVERS\\kljstekenebackendmetauth\\src\\rest\\_bestuur.js:52:22)\n    at async D:\\SERVERS\\kljstekenebackendmetauth\\src\\createServer.js:82:4\n    at async D:\\SERVERS\\kljstekenebackendmetauth\\src\\createServer.js:72:4\n    at async bodyParser (D:\\SERVERS\\kljstekenebackendmetauth\\node_modules\\koa-bodyparser\\index.js:95:5)\n    at async cors (D:\\SERVERS\\kljstekenebackendmetauth\\node_modules\\@koa\\cors\\index.js:56:32)"
 * /bestuur/login:
 *   post:
 *     summary: Login to get the bearer token
 *     description: Return the bearer token
 *     tags:
 *       - Bestuur
 *     requestBody:
 *       $ref: "#/components/requestBodies/Login"
 *     responses:
 *       200:
 *         description: All of the cridentials are returned needed for the login state.
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bestuurslid:
 *                 id:
 *                   type: "string"
 *                   format: uuid
 *                 firstName:
 *                   type: "string"
 *                 lastName:
 *                   type: "string"
 *                 mail:
 *                   type: "string"
 *               token:
 *                 type: "string"
 * /bestuur/Register:
 *    post:
 *      summary: Register a new bestuurslid
 *      description: Returns the bearer token and creates a new bestuurslid in the database.
 *      tags:
 *        - Bestuur
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Register"
 *      responses:
 *        201:
 *          description: There was a correct token given and a new (not yet existing) user is created
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                bestuurslid:
 *                  id:
 *                    type: "string"
 *                    format: uuid
 *                  firstName:
 *                    type: "string"
 *                  lastName:
 *                    type: "string"
 *                  mail:
 *                    type: "string"
 *                token:
 *                  type: "string"
 * /bestuur/:
 *   get:
 *     summary: List of all bestuursleden
 *     description: Returns all bestuur from the database, alongside the given limit, offset and count.
 *     tags:
 *       - Bestuur
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: The list off bestuur is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurList"
 * /bestuur/{id}:
 *   get:
 *     summary: Requested bestuurslid (by ID)
 *     description: Returns the requested bestuurslid from the database by the given ID.
 *     tags:
 *       - Bestuur
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested bestuurslid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurSafe"
 *   put:
 *     summary: Updating bestuurslid (by ID)
 *     description: Returns the updated bestuurslid from the database by the given ID.
 *     tags:
 *       - Bestuur
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Bestuurslid"
 *     responses:
 *       200:
 *         description: The updated bestuurslid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurSafe"
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete bestuurslid (by ID)
 *     description: Just deletes the requested bestuurslid in the DB by the given ID.
 *     tags:
 *       - Bestuur
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: the bestuurslid has been deleted
 *     security:
 *       - bearerAuth: []
 */