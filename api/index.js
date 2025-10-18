export default async (req, res) =>
	await import("../dist/landing/server/server.mjs").then((m) =>
		m.reqHandler(req, res),
	);
