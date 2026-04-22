// backend/routes/games-normalizer.js
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve('data');

// Helper to load and normalize all games from all providers
export async function loadAllGames() {
	const files = [
		'provider-alpha.json',
		'provider-beta.json',
		'provider-gamma.json'
	];
	let allGames = [];

	// Provider Alpha
	try {
		const alphaRaw = await fs.readFile(path.join(dataDir, files[0]), 'utf-8');
		const alphaGames = JSON.parse(alphaRaw).map(g => ({
			id: g.gameId,
			name: g.title,
			provider: g.studio,
			category: g.type,
			enabled: !!g.active,
			rtp: g.returnToPlayer,
			thumbnail: g.thumbnail,
			features: g.features || [],
			releaseDate: g.launchDate
		}));
		allGames = allGames.concat(alphaGames);
	} catch { }

	// Provider Beta
	try {
		const betaRaw = await fs.readFile(path.join(dataDir, files[1]), 'utf-8');
		const betaGames = JSON.parse(betaRaw).map(g => ({
			id: g.gameCode,
			name: g.gameName,
			provider: g.providerName,
			category: g.gameCategory,
			enabled: g.isEnabled === 1,
			rtp: parseFloat(g.rtpValue),
			thumbnail: g.imageUrl,
			features: g.tagList ? g.tagList.split(',').filter(Boolean) : [],
			releaseDate: g.releaseDate
		}));
		allGames = allGames.concat(betaGames);
	} catch { }

	// Provider Gamma
	try {
		const gammaRaw = await fs.readFile(path.join(dataDir, files[2]), 'utf-8');
		const gammaGames = JSON.parse(gammaRaw).map(g => {
			const a = g.data.attributes;
			return {
				id: g.data.id,
				name: a.displayName,
				provider: a.provider.label,
				category: a.classification.category,
				enabled: !!a.status.enabled,
				rtp: a.metrics.rtp ? Math.round(a.metrics.rtp * 10000) / 100 : undefined,
				thumbnail: a.media.thumbnailUrl,
				features: a.tags || [],
				releaseDate: a.status.released
			};
		});
		allGames = allGames.concat(gammaGames);
	} catch { }

	return allGames;
}
