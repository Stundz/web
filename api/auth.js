export default async (req, res) => {
	return await import("../dist/auth/server/server.mjs").then((m) =>
		m.reqHandler(req, res),
	);
};
