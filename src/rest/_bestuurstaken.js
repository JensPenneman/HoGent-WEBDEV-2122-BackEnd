const Joi    = require("joi");
const Router = require("@koa/router");

const bestuurstaakService = require("../service/bestuurstaak");
const {
		  requireAuthentication,
		  makeRequireBestuurstaak,
	  }                   = require("../core/auth");
const validate            = require("./_validation");

const getAllbestuurstaken            = async (ctx) => {
	ctx.body = await bestuurstaakService.getAll(ctx.query.limit && Number(ctx.query.limit), ctx.query.offset && Number(ctx.query.offset));
};
getAllbestuurstaken.validationScheme = {
	query: Joi.object({
						  limit:  Joi.number().integer().positive().max(1000).optional(),
						  offset: Joi.number().integer().min(0).optional(),
					  })
			  .and("limit", "offset"),
};

const getBestuurstaakById            = async (ctx) => {
	ctx.body = await bestuurstaakService.getById(ctx.params.id);
};
getBestuurstaakById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const createBestuurstaak            = async (ctx) => {
	ctx.body  = await bestuurstaakService.create({...ctx.request.body});
	ctx.status            = 201;
};
createBestuurstaak.validationScheme = {
	body: {
		name:        Joi.string().max(255),
		description: Joi.string().max(255),
		isSiteAdmin: Joi.boolean(),
	},
};

const updateBestuurstaak            = async (ctx) => {
	ctx.body = await bestuurstaakService.updateById(ctx.params.id, ctx.request.body);
};
updateBestuurstaak.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body:   {
		name:        Joi.string().max(255),
		description: Joi.string().max(255),
		isSiteAdmin: Joi.boolean(),
	},
};

const deleteBestuurstaak            = async (ctx) => {
	await bestuurstaakService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteBestuurstaak.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = async function installBestuurstakenRoutes(app) {
	const router = new Router({
								  prefix: "/bestuurstaken",
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
	router.get("/", validate(getAllbestuurstaken.validationScheme), getAllbestuurstaken);
	router.get("/:id", validate(getBestuurstaakById.validationScheme), getBestuurstaakById);
	router.post("/", requireAuthentication, requireAdmin, validate(createBestuurstaak.validationScheme), createBestuurstaak);
	router.put("/:id", requireAuthentication, requireAdmin, validate(updateBestuurstaak.validationScheme), updateBestuurstaak);
	router.delete("/:id", requireAuthentication, requireAdmin, validate(deleteBestuurstaak.validationScheme), deleteBestuurstaak);

	app.use(router.routes()).use(router.allowedMethods());
};

/**
 * @swagger
 * tags:
 *   name: Bestuurstaken
 *   description: Everything that has to do with the tasks for the people and admin rules for the website
 * components:
 *   schemas:
 *     BestuurstakenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Bestuurstaken"
 *   requestBodies:
 *     Bestuurstaak:
 *       description: The credentials for a bestuurstaak
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: "string"
 *                 example: "Sportfeestverantwoordelijke"
 *               description:
 *                 type: "string"
 *                 example: "Houdt zich voornamelijk bezig met taken in de zomer"
 *               isSiteAdmin:
 *                 type: "boolean"
 *                 example: "false"
 *   examples:
 *     Bestuurstaak:
 *       id: "7a009ab1-4d9e-4216-8a84-0dd65af2200e"
 *       name: "Hoofdbestuur"
 *       description: "Ons hoofdbestuur weet overal van! Van het kleinste weetje tot het grootste evenement..."
 *       isSiteAdmin: true
 * /bestuurstaken/:
 *   get:
 *     summary: List of all bestuurstaken
 *     description: Returns all bestuur from the database, alongside the given limit, offset and count.
 *     tags:
 *       - Bestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam"
 *     responses:
 *       200:
 *         description: The list off bestuur is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BestuurstakenList"
 *   post:
 *     summary: Add a bestuurstaak to the DB
 *     description: Return the created bestuurstaak
 *     tags:
 *       - Bestuurstaken
 *     requestBody:
 *       $ref: "#/components/requestBodies/Bestuurstaak"
 *     responses:
 *       201:
 *         description: The bestuurstaak has been created in the DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bestuurstaken"
 *     security:
 *       - bearerAuth: []
 * /bestuurstaken/{id}:
 *   get:
 *     summary: Requested bestuurstaak (by ID)
 *     description: Returns the requested bestuurstaak from the database by the given ID.
 *     tags:
 *       - Bestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested bestuurslid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bestuurstaken"
 *   put:
 *     summary: Updating bestuurstaak (by ID)
 *     description: Returns the updated bestuurstaak from the database by the given ID.
 *     tags:
 *       - Bestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Bestuurstaak"
 *     responses:
 *       200:
 *         description: The updated bestuurstaak
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bestuurstaken"
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete bestuurstaak (by ID)
 *     description: Just deletes the requested bestuurstaak in the DB by the given ID.
 *     tags:
 *       - Bestuurstaken
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: the bestuurstaak has been deleted
 *     security:
 *       - bearerAuth: []
 */