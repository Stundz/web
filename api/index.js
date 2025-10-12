export default async () => {
	const { app } = await import("../dist/plug/server/server.mjs");

	return app;
};
