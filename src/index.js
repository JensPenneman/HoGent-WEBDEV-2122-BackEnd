const createServer = require("./createServer");

async function main() {
	try {
		const server = await createServer();
		await server.start();

		async function onClose() {
			await server.stop();
			process.exit();
		}

		process.on("SIGTERM", onClose);
		process.on("SIGQUIT", onClose);
		// In WebStorm, de IDE naar keuze van mij (Jens Penneman), word SIGINT gebruikt als exit eventName:
		process.on("SIGINT", onClose);
	}
	catch (error) {
		process.exit(-1);
	}
}

main();