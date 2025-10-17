export default async (req, res) => {
	return await import("../dist/plug/server/server.mjs").then((m) =>
		m.reqHandler(req, res),
	);
};
