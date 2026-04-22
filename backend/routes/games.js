// backend/routes/games.js
import fp from 'fastify-plugin';
import { loadAllGames } from './games-normalizer.js';

async function gamesRoutes(fastify, opts) {
	fastify.get('/api/games', async (request, reply) => {
		// Extract query params
		const {
			search,
			name,
			provider,
			category,
			enabled = 'true',
			sort = 'name',
			order = 'asc',
			page = 1,
			pageSize = 20
		} = request.query;

		// Load and normalize all games from data files
		let games = await loadAllGames();

		// Filter
		let filtered = games.filter(game => {
			if (enabled !== undefined && String(game.enabled) !== String(enabled)) return false;
			if (provider && game.provider !== provider) return false;
			if (category && game.category !== category) return false;
			if (search && !game.name.toLowerCase().includes(search.toLowerCase())) return false;
			if (name && !game.name.toLowerCase().includes(name.toLowerCase())) return false;
			return true;
		});

		// Sort
		filtered.sort((a, b) => {
			let valA = a[sort];
			let valB = b[sort];
			if (typeof valA === 'string') valA = valA.toLowerCase();
			if (typeof valB === 'string') valB = valB.toLowerCase();
			if (valA < valB) return order === 'asc' ? -1 : 1;
			if (valA > valB) return order === 'asc' ? 1 : -1;
			return 0;
		});

		// Pagination
		const total = filtered.length;
		const pageNum = parseInt(page, 10) || 1;
		const size = parseInt(pageSize, 10) || 20;
		const totalPages = Math.ceil(total / size);
		const start = (pageNum - 1) * size;
		const end = start + size;
		const paged = filtered.slice(start, end);

		return {
			data: paged,
			meta: {
				total,
				page: pageNum,
				pageSize: size,
				totalPages
			}
		};
	});
}

export default fp(gamesRoutes);
