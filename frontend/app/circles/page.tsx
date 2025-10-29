'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

export default function CirclesPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [circles, setCircles] = useState([
    { id: 1, name: 'Alpha Traders', members: 24, tvl: 450000, rank: 1 },
    { id: 2, name: 'DeFi Warriors', members: 18, tvl: 380000, rank: 2 },
    { id: 3, name: 'Yield Hunters', members: 32, tvl: 520000, rank: 3 },
  ]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');

  const handleJoinClick = (circle: any) => {
    setSelectedCircle(circle);
    setShowJoinModal(true);
  };

  const confirmJoin = () => {
    alert(`Joined ${selectedCircle.name}!`);
    setShowJoinModal(false);
    setSelectedCircle(null);
  };

  const handleCreateClick = () => {
    if (!newCircleName.trim()) {
      alert('Please enter a circle name');
      return;
    }
    setShowCreateModal(true);
  };

  const confirmCreate = () => {
    alert(`Created circle: ${newCircleName}!`);
    setShowCreateModal(false);
    setNewCircleName('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl">Please connect wallet</h1>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-600 rounded">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-4 text-blue-400">
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">Circle Clash 🏆</h1>

        {/* Current Season */}
        <div className="bg-gray-900 p-6 rounded mb-8">
          <h2 className="text-2xl font-bold mb-4">Season 1 - Active</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-gray-400">Time Remaining</div>
              <div className="text-2xl font-bold">14 days</div>
            </div>
            <div>
              <div className="text-gray-400">Total Prize Pool</div>
              <div className="text-2xl font-bold">$100,000</div>
            </div>
            <div>
              <div className="text-gray-400">Participating Circles</div>
              <div className="text-2xl font-bold">48</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <div className="space-y-4">
            {circles.map((circle) => (
              <div key={circle.id} className="bg-gray-800 p-4 rounded flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-yellow-400">#{circle.rank}</div>
                  <div>
                    <div className="font-bold text-lg">{circle.name}</div>
                    <div className="text-gray-400">{circle.members} members</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${circle.tvl.toLocaleString()}</div>
                  <div className="text-gray-400">Total TVL</div>
                </div>
                <button 
                  onClick={() => handleJoinClick(circle)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Circle */}
        <div className="mt-8 bg-gray-900 p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">Create Your Circle</h2>
          <input
            type="text"
            value={newCircleName}
            onChange={(e) => setNewCircleName(e.target.value)}
            placeholder="Circle Name"
            className="w-full bg-gray-800 p-4 rounded mb-4 text-white"
          />
          <button 
            onClick={handleCreateClick}
            className="w-full bg-green-600 hover:bg-green-700 p-4 rounded font-bold"
          >
            Create Circle
          </button>
        </div>

        {/* Join Confirmation Modal */}
        {showJoinModal && selectedCircle && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Join Circle?</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to join <span className="font-bold text-white">{selectedCircle.name}</span>?
              </p>
              
              <div className="bg-gray-800 p-4 rounded mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Members:</span>
                  <span className="font-bold">{selectedCircle.members}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total TVL:</span>
                  <span className="font-bold">${selectedCircle.tvl.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rank:</span>
                  <span className="font-bold text-yellow-400">#{selectedCircle.rank}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 p-3 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold"
                >
                  Confirm Join
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Confirmation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Create Circle?</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to create a new circle called <span className="font-bold text-white">{newCircleName}</span>?
              </p>
              
              <div className="bg-gray-800 p-4 rounded mb-6">
                <p className="text-sm text-gray-400 mb-2">As the creator, you will:</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Be the circle leader</li>
                  <li>• Manage circle members</li>
                  <li>• Set investment strategies</li>
                  <li>• Compete in Circle Clash</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 p-3 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCreate}
                  className="flex-1 bg-green-600 hover:bg-green-700 p-3 rounded font-bold"
                >
                  Create Circle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
