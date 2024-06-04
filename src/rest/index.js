const Router = require("@koa/router");

const installBestuurRouter             = require("./_bestuur");
const installBestuurBestuurstaakRouter = require("./_bestuurslid_bestuurstaak");
const installBestuurstakenRouter       = require("./_bestuurstaken");


module.exports = (app) => {
	const router = new Router({
								  prefix: "/api",
							  });

	installBestuurRouter(router);
	installBestuurBestuurstaakRouter(router);
	installBestuurstakenRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     limitParam:
 *       in: query
 *       name: limit
 *       description: Maximum amount of items to return
 *       required: false
 *       schema:
 *         type: integer
 *         default: 100
 *     offsetParam:
 *       in: query
 *       name: offset
 *       description: Number of items to skip
 *       required: false
 *       schema:
 *         type: integer
 *         default: 0
 *     idParam:
 *       in: path
 *       name: id
 *       description: the id
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "aa4f4f89-904c-4ddd-878b-224018e65926"
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: "uuid"
 *       example:
 *         id: "54bdb78c-be12-4e6a-b7fe-3848ac73bca6"
 *     ListResponse:
 *       required:
 *         - count
 *         - limit
 *         - offset
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Limit actually used
 *           example: 100
 *         offset:
 *           type: integer
 *           description: Offset actually used
 *           example: 0
 *     Bestuur:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - mail
 *             - passwordHash
 *           properties:
 *             firstName:
 *               type: "string"
 *             lastName:
 *               type: "string"
 *             mail:
 *               type: "string"
 *             passwordHash:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Bestuurslid"
 *     BestuurSafe:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - firstName
 *             - lastName
 *             - mail
 *           properties:
 *             firstName:
 *               type: "string"
 *             lastName:
 *               type: "string"
 *             mail:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/BestuurslidSafe"
 *     Bestuurstaken:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - description
 *             - isSiteAdmin
 *           properties:
 *             naam:
 *               type: "string"
 *             description:
 *               type: "string"
 *             isSiteAdmin:
 *               type: "boolean"
 *           example:
 *             $ref: "#/components/examples/Bestuurstaak"
 *     BestuurBestuurstaken:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - bestuurslid
 *             - bestuurstaak
 *           properties:
 *             bestuurslid:
 *               $ref: "#/components/schemas/BestuurSafe"
 *             bestuurstaak:
 *               $ref: "#/components/schemas/Bestuurstaken"
 *           example:
 *             $ref: "#/components/examples/BestuurslidBestuurstaak"
 *   examples:
 *     Bestuurslid:
 *       id: "aa4f4f89-904c-4ddd-878b-224018e65926"
 *       firstName: "Jarno"
 *       lastName: "Schepens"
 *       mail: "jarno.schepens@kljstekene.be"
 *       passwordHash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4"
 *     BestuurslidSafe:
 *       id: "aa4f4f89-904c-4ddd-878b-224018e65926"
 *       firstName: "Jarno"
 *       lastName: "Schepens"
 *       mail: "jarno.schepens@kljstekene.be"
 *     Bestuurstaak:
 *       id: "7a009ab1-4d9e-4216-8a84-0dd65af2200e"
 *       name: "Hoofdbestuur"
 *       description: "Ons hoofdbestuur weet overal van! Van het kleinste weetje tot het grootste evenement..."
 *       isSiteAdmin: true
 *     BestuurslidBestuurstaak:
 *       id: "78211394-48d3-4506-b49e-d5f0e6671ca5"
 *       bestuurslid:
 *         $ref: "#/components/examples/BestuurslidSafe"
 *       bestuurstaak:
 *         $ref: "#/components/examples/Bestuurstaak"
 */