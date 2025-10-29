'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

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

  const achievements = [
    { id: 1, name: 'First Deposit', unlocked: true },
    { id: 2, name: 'Week Warrior', unlocked: true },
    { id: 3, name: 'Yield Master', unlocked: false },
    { id: 4, name: 'Circle Leader', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-4 text-blue-400">
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        {/* Wallet Info */}
        <div className="bg-gray-900 p-6 rounded mb-8">
          <h2 className="text-xl font-bold mb-4">Wallet</h2>
          <div className="text-gray-400 mb-2">Address</div>
          <div className="font-mono bg-gray-800 p-3 rounded">{address}</div>
        </div>

        {/* Profile Settings */}
        <div className="bg-gray-900 p-6 rounded mb-8">
          <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
          
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-gray-800 p-3 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="w-full bg-gray-800 p-3 rounded h-24"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold">
            Save Profile
          </button>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900 p-6 rounded">
          <h2 className="text-xl font-bold mb-4">Achievements 🏆</h2>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded ${
                  achievement.unlocked ? 'bg-yellow-900/30 border border-yellow-500' : 'bg-gray-800 opacity-50'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.unlocked ? '🏆' : '🔒'}</div>
                <div className="font-bold">{achievement.name}</div>
                <div className="text-sm text-gray-400">
                  {achievement.unlocked ? 'Unlocked!' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
