module.exports = {
	server:            {
		port: 3001,
	},
	log:               {
		level:    "silly",
		disabled: false,
	},
	CORS:              {
		origins: ["http://localhost:3000", "http://localhost:3001/"],
		maxAge:  3 * 60 * 60,
	},
	database:          {
		client:   "mysql2",
		host:     "localhost",
		port:     3306,
		name:     "kljstekene",
		username: "root",
		password: "root",
	},
	defaultPagination: {
		limit:  100,
		offset: 0,
	},
	auth:              {
		argon: {
			saltLength: 16,
			hashLength: 32,
			timeCost:   6,
			memoryCost: 2 ** 17,
		},
		jwt:   {
			secret:             "DitIsEenSiteVoorKLJStekeneEnNiemandZalDezeStringRadenOmdatDezeZoLangIs",
			expirationInterval: 60 * 60 * 1000,
			issuer:             "kljstekene.be",
			audience:           "kljstekene.be",
		},
	},
};