export default async (req, res) => {
	return await import("../dist/premifly/server/server.mjs").then((m) =>
		m.reqHandler(req, res),
	);
};
