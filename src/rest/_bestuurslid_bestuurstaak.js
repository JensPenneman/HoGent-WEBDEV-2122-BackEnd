const Joi    = require("joi");
const Router = require("@koa/router");

const bestuurslid_bestuurstaakService = require("../service/bestuurslid_bestuurstaak");
const bestuurstaakService             = require("../service/bestuurstaak");
const {
		  requireAuthentication,
		  makeRequireBestuurstaak,
	  }                               = require("../core/auth");
const validate                        = require("./_validation");

const getAllBestuur_bestuurstaken            = async (ctx) => {
	const limit  = ctx.query.limit && Number(ctx.query.limit);
	const offset = ctx.query.offset && Number(ctx.query.offset);
	ctx.body     = await bestuurslid_bestuurstaakService.getAll(limit, offset);
};
getAllBestuur_bestuurstaken.validationScheme = {
	query: Joi.object({
						  limit:  Joi.number().integer().positive().max(1000).optional(),
						  offset: Joi.number().integer().min(0).optional(),
					  })
			  .and("limit", "offset"),
};

const getBestuurslid_bestuurstaakById            = async (ctx) => {
	ctx.body = await bestuurslid_bestuurstaakService.getById(ctx.params.id);
};
getBestuurslid_bestuurstaakById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const createBestuurslid_bestuurstaak            = async (ctx) => {
	ctx.body   = await bestuurslid_bestuurstaakService.create({
																  ...ctx.request.body,
															  });
	ctx.status = 201;
};
createBestuurslid_bestuurstaak.validationScheme = {
	body: {
		bestuurslid_id:  Joi.string().uuid(),
		bestuurstaak_id: Joi.string().uuid(),
	},
};

const updateBestuurslid_bestuurstaak            = async (ctx) => {
	ctx.body = await bestuurslid_bestuurstaakService.updateById(ctx.params.id, {
		...ctx.request.body,
	});
};
updateBestuurslid_bestuurstaak.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body:   {
		bestuurslid_id:  Joi.string().uuid(),
		bestuurstaak_id: Joi.string().uuid(),
	},
};

const deleteBestuurslid_bestuurstaak            = async (ctx) => {
	await bestuurslid_bestuurstaakService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteBestuurslid_bestuurstaak.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = async function installBestuurstakenRoutes(app) {
	const router = new Router({
								  prefix: "/bestuurslid_bestuurstaak",
							  });

	let siteAdmins     = await bestuurstaakService.getAll(300, 0);
	siteAdmins         = siteAdmins.data
								   .filter((bestuurstaak) => {
									   return bestuurstaak.isSiteAdmin === 1;
								   })
								   .map((bestuurstaak) => {
									   return bestuurstaak.id;
								   });
	const requireAdmin = makeRequireBestuurstaak(siteAdmins);
	router.get("/", validate(getAllBestuur_bestuurstaken.validationScheme), getAllBestuur_bestuurstaken);
	router.get("/:id", validate(getBestuurslid_bestuurstaakById.validationScheme), getBestuurslid_bestuurstaakById);
	router.post("/", requireAuthentication, requireAdmin, validate(createBestuurslid_bestuurstaak.validationScheme), createBestuurslid_bestuurstaak);
	router.put("/:id", requireAuthentication, requireAdmin, validate(updateBestuurslid_bestuurstaak.validationScheme), updateBestuurslid_bestuurstaak);
	router.delete("/:id", requireAuthentication, requireAdmin, validate(deleteBestuurslid_bestuurstaak.validationScheme), deleteBestuurslid_bestuurstaak);

	app.use(router.routes()).use(router.allowedMethods());
};



/**
 * @swagger
 * tags:
 *   name: BestuurBestuurstaken
 *   description: Everything that has to do with the connection between the people and tasks.
 * components:
 *   schemas:
 *     BestuurBestuurstakenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BestuurBestuurstaken"
 *   requestBodies:
 *     BestuurslidBestuurstaak:
 *       description: The credentials to connect a person to a task
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bestuurslid_id:
 *                 type: "string"
 *                 format: "uuid"
 *                 example: "aa4f4f89-904c-4ddd-878b-224018e65926"
 *               bestuurstaak_id:
 *                 type: "string"
 *                 format: "uuid"
 *                 example: "ab5afbc4-b741-494e-adfa-c628affcac88"
 * /bestuurslid_bestuurstaak/:
 *   get:
 *     summary: List of all bestuurslid-bestuurstaak connections
 *     description: Returns all bestuurslid-bestuurstaak connections from the database, alongside the given limit, offset and count.
 *     tags:
 *       - BestuurBestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: The list off bestuurslid-bestuurstaak connections is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurBestuurstakenList"
 *   post:
 *     summary: Add a bestuurslid-bestuurstaak connection to the DB
 *     description: Return the created bestuurslid-bestuurstaak connection
 *     tags:
 *       - BestuurBestuurstaken
 *     requestBody:
 *       $ref: "#/components/requestBodies/BestuurslidBestuurstaak"
 *     responses:
 *       201:
 *         description: The bestuurslid-bestuurstaak connection has been created in the DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurBestuurstaken"
 *     security:
 *       - bearerAuth: []
 * /bestuurslid_bestuurstaak/{id}:
 *  get:
 *     summary: Requested bestuurslid-bestuurstaak connection (by ID)
 *     description: Returns the requested bestuurslid-bestuurstaak connection from the database by the given ID.
 *     tags:
 *       - BestuurBestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested bestuurslid-bestuurstaak connection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurBestuurstaken"
 *  put:
 *     summary: Updating bestuurslid-bestuurstaak connection (by ID)
 *     description: Returns the updated bestuurslid-bestuurstaak connection from the database by the given ID.
 *     tags:
 *       - BestuurBestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/BestuurslidBestuurstaak"
 *     responses:
 *       200:
 *         description: The updated bestuurslid-bestuurstaak connection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurBestuurstaken"
 *     security:
 *       - bearerAuth: []
 *  delete:
 *     summary: Delete bestuurslid-bestuurstaak connection (by ID)
 *     description: Just deletes the requested bestuurslid-bestuurstaak connection in the DB by the given ID.
 *     tags:
 *       - BestuurBestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: the bestuurslid-bestuurstaak connection has been deleted
 *     security:
 *       - bearerAuth: []
 */