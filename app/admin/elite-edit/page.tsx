'use client';

import { useState, useEffect } from 'react';

interface Elite {
  name: string;
  pointsPerLoss: number;
  badge: string;
  [key: string]: any;
}

export default function EliteAdminPage() {
  const [password, setPassword] = useState('');
  const [elites, setElites] = useState<Elite[]>([]);
  const [selected, setSelected] = useState('');
  const [pointsPerLoss, setPointsPerLoss] = useState('');
  const [badge, setBadge] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setElites(Array.isArray(data.leaderboard1) ? data.leaderboard1 : []);
      });
  }, []);

  const handleSelect = (e: any) => {
    const name = e.target.value;
    setSelected(name);
    const elite = elites.find((el) => el.name === name);
    setPointsPerLoss(elite?.pointsPerLoss?.toString() ?? '');
    setBadge(elite?.badge ?? '');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    const res = await fetch('/api/admin/update-elite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: selected, pointsPerLoss, badge, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 401) {
      setMessage('Wrong password');
      setIsError(true);
    } else if (data.success) {
      setMessage('Updated!');
      setIsError(false);
    } else {
      setMessage(data.error || 'Error');
      setIsError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="mb-4 font-bold">Edit Elite</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mt-2">Admin Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <select value={selected} onChange={handleSelect} className="border p-2 w-full mb-2 bg-black text-white">
          <option value="">Select Elite</option>
          {Array.isArray(elites) && elites.map((el) => (
            <option key={el.name} value={el.name}>{el.name}</option>
          ))}
        </select>
        <label className="block mt-2">Points Per Loss</label>
        <input
          type="number"
          value={pointsPerLoss}
          onChange={e => setPointsPerLoss(e.target.value)}
          className="border p-2 w-full mb-2 bg-black text-white"
        />
        <label className="block mt-2">Badge (comma-separated URLs)</label>
        <input
          type="text"
          value={badge}
          onChange={e => setBadge(e.target.value)}
          className="border p-2 w-full mb-2 bg-black text-white"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-2" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      <div className={isError ? "mt-2 text-red-600" : "mt-2 text-green-600"}>{message}</div>
    </div>
  );
}