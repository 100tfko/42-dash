import React, { useEffect, useState } from 'react';
import GameGrid from './GameGrid';

const PAGE_SIZE = 12;

export default function App() {
	const [games, setGames] = useState([]);
	const [meta, setMeta] = useState({});
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [provider, setProvider] = useState('');
	const [page, setPage] = useState(1);
	const [categories, setCategories] = useState([]);
	const [providers, setProviders] = useState([]);
	const [loading, setLoading] = useState(false);

	// Fetch games
	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams();
		if (search) params.append('search', search);
		if (category) params.append('category', category);
		if (provider) params.append('provider', provider);
		params.append('page', page);
		params.append('pageSize', PAGE_SIZE);
		fetch(`/api/games?${params.toString()}`)
			.then(r => r.json())
			.then(res => {
				setGames(res.data || []);
				setMeta(res.meta || {});
				// Collect unique categories/providers for filters
				if (page === 1) {
					setCategories(Array.from(new Set((res.data || []).map(g => g.category).filter(Boolean))));
					setProviders(Array.from(new Set((res.data || []).map(g => g.provider).filter(Boolean))));
				}
			})
			.finally(() => setLoading(false));
	}, [search, category, provider, page]);

	// Handlers
	const handleSearch = e => {
		setSearch(e.target.value);
		setPage(1);
	};
	const handleCategory = e => {
		setCategory(e.target.value);
		setPage(1);
	};
	const handleProvider = e => {
		setProvider(e.target.value);
		setPage(1);
	};

	return (
		<div style={{ textAlign: 'center', marginTop: '2rem', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
			<h1>QTechDash Minimal Frontend</h1>
			<div style={{ margin: '1rem 0', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
				<input
					type="text"
					placeholder="Search games..."
					value={search}
					onChange={handleSearch}
					style={{ padding: 6, minWidth: 180 }}
				/>
				<select value={category} onChange={handleCategory} style={{ padding: 6 }}>
					<option value="">All Categories</option>
					{categories.map(cat => (
						<option key={cat} value={cat}>{cat}</option>
					))}
				</select>
				<select value={provider} onChange={handleProvider} style={{ padding: 6 }}>
					<option value="">All Providers</option>
					{providers.map(prov => (
						<option key={prov} value={prov}>{prov}</option>
					))}
				</select>
			</div>
			{loading ? <div>Loading...</div> : <GameGrid games={games} />}
			<div style={{ margin: '2rem 0', display: 'flex', justifyContent: 'center', gap: 16 }}>
				<button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
				<span>Page {meta.page || page} / {meta.totalPages || 1}</span>
				<button onClick={() => setPage(p => (meta.totalPages ? Math.min(meta.totalPages, p + 1) : p + 1))} disabled={meta.page >= meta.totalPages}>Next</button>
			</div>
		</div>
	);
}
