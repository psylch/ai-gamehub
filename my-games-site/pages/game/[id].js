import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DynamicContent from '../../components/DynamicContent';

export default function GamePage() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/games/${id}`)
        .then(response => response.json())
        .then(data => setGame(data));
    }
  }, [id]);

  if (!game) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container">
      <Link href="/">
        <button className="mb-4 px-4 py-2 bg-accent text-primary rounded hover:bg-secondary">Back to Home</button>
      </Link>
      <h1 className="text-4xl font-bold mb-8 text-center">{game.game_title}</h1>
      <div className="border rounded-lg shadow-lg p-6 bg-secondary">
        <DynamicContent content={game.game_code_content} />
      </div>
    </div>
  );
}
