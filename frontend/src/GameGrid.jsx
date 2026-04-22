import React from 'react';

export default function GameGrid({ games }) {
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
			{games.map(game => (
				<div
					key={game.id}
					data-testid="game-card"
					style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 220 }}
				>
					<h3>{game.name}</h3>
					<div>Provider: {game.provider}</div>
					<div>Category: {game.category}</div>
				</div>
			))}
		</div>
	);
}
