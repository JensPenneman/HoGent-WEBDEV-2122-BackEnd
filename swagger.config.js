module.exports = {
	definition: {
		openapi: "3.0.0",
		info:    {
			title:       "KLJ Stekene",
			version:     "0.1.0",
			description: "This is a simple CRUD API application made with Koa and documented with Swagger",
			license:     {
				name: "MIT",
				url:  "https://spdx.org/licenses/MIT.html",
			},
			contact:     {
				name:  "Jens Penneman",
				url:   "http://074591jp.cloudns.ph:3000/",
				email: "jens.penneman@student.hogent.be",
			},
		},
		servers: [{
			"url":         "http://localhost:{port}/{basePath}",
			"description": "The development API server",
			"variables":   {
				"port":     {
					"enum":    ["3001", "9000"],
					"default": "3001",
				},
				"basePath": {
					"default": "api",
				},
			},
		}/*, {
			"url":         "http://{username}.cloudns.ph:{port}/{basePath}",
			"description": "The production API server",
			"variables":   {
				"username": {
					"default":     "074591jp",
					"description": "This value is the student ID for Jens Penneman",
				},
				"port":     {
					"enum":    ["3001", "9000"],
					"default": "3001",
				},
				"basePath": {
					"default": "api",
				},
			},
		}*/],
	},
	apis:       ["./src/rest/*.js"],
};