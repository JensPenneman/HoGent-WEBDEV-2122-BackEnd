const BESTUUR = [
	{
		id:           "aa4f4f89-904c-4ddd-878b-224018e65926",
		firstName:    "Jarno",
		lastName:     "Schepens",
		mail:         "jarno.schepens@kljstekene.be",
		passwordHash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
	},
	{
		id:           "a962782b-06d6-4a2c-8dd6-4111bb5d42de",
		firstName:    "Nina",
		lastName:     "Selis",
		mail:         "nina.selis@kljstekene.be",
		passwordHash: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4",
	},
];

const BESTUURSTAKEN = [
	{
		id:          "7a009ab1-4d9e-4216-8a84-0dd65af2200e",
		name:        "Hoofdbestuur",
		description: "Ons hoofdbestuur weet overal van! Van het kleinste weetje tot het grootste evenement...",
		isSiteAdmin: true,
	},
	{
		id:          "ab5afbc4-b741-494e-adfa-c628affcac88",
		name:        "Websiteverantwoordelijke",
		description: "De websiteverantwoordelijke zorgt dat de website kljstekene.be er volledig actueel en verzorgt uitziet.",
		isSiteAdmin: false,
	}
];

const BESTUUR_BESTUURSTAKEN = [
	{
		id:              "78211394-48d3-4506-b49e-d5f0e6671ca5",
		id_bestuurslid:  "aa4f4f89-904c-4ddd-878b-224018e65926",
		id_bestuurstaak: "7a009ab1-4d9e-4216-8a84-0dd65af2200e",
	},
	{
		id:              "78211394-48d3-4506-b49e-d5f0e6671ca6",
		id_bestuurslid:  "a962782b-06d6-4a2c-8dd6-4111bb5d42de",
		id_bestuurstaak: "ab5afbc4-b741-494e-adfa-c628affcac88",
	},
];

module.exports = {
	BESTUUR,
	BESTUURSTAKEN,
	BESTUUR_BESTUURSTAKEN,
};