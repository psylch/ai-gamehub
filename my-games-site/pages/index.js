import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/games')
      .then(response => response.json())
      .then(data => setGames(data));
  }, []);

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-8 text-center text-accent">Artifacts Hub</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map(game => (
          <li key={game.id} className="border border-secondary rounded-lg shadow-lg overflow-hidden">
            <Link href={`/game/${game.id}`}>
              <div className="block p-4 hover:bg-secondary cursor-pointer">
                <h2 className="text-2xl font-semibold mb-2">{game.game_title}</h2>
                <p className="text-gray-400">Creator: {game.user_id}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
