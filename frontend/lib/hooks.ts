import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import apiService from './api';

// Hook for fetching vaults
export function useVaults() {
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVaults() {
      try {
        setLoading(true);
        const data = await apiService.vaults.getAll();
        setVaults(data?.vaults || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch vaults:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vaults');
        setVaults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVaults();
  }, []);

  return { vaults, loading, error, refetch: () => {} };
}

// Hook for user vaults
export function useUserVaults() {
  const { address } = useAccount();
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserVaults() {
      if (!address) {
        setVaults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.users.getVaults(address);
        setVaults(data?.vaults || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user vaults:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user vaults');
        setVaults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserVaults();
  }, [address]);

  return { vaults, loading, error };
}

// Hook for user profile
export function useUserProfile() {
  const { address } = useAccount();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!address) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.users.getProfile(address);
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [address]);

  return { profile, loading, error };
}

// Hook for portfolio analytics
export function usePortfolio() {
  const { address } = useAccount();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!address) {
        setPortfolio(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.analytics.getPortfolio(address);
        setPortfolio(data || null);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [address]);

  return { portfolio, loading, error };
}

// Hook for performance data
export function usePerformance(days: number = 30) {
  const { address } = useAccount();
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPerformance() {
      if (!address) {
        setPerformance([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.analytics.getPerformance(address, days);
        setPerformance(data.performance || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch performance');
        setPerformance([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformance();
  }, [address, days]);

  return { performance, loading, error };
}

// Hook for achievements
export function useAchievements() {
  const { address } = useAccount();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      if (!address) {
        setAchievements([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.social.getAchievements(address);
        setAchievements(data.achievements || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch achievements');
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [address]);

  return { achievements, loading, error };
}

// Hook for circle clash rankings
export function useCircleClash() {
  const [season, setSeason] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCircleClash() {
      try {
        setLoading(true);
        const [seasonData, rankingsData] = await Promise.all([
          apiService.circleClash.getSeason(),
          apiService.circleClash.getRankings(10),
        ]);
        setSeason(seasonData);
        setRankings(rankingsData.rankings || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch circle clash');
        setSeason(null);
        setRankings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCircleClash();
  }, []);

  return { season, rankings, loading, error };
}

// Hook for leaderboard
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const data = await apiService.social.getLeaderboard();
        setLeaderboard(data.leaderboard || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return { leaderboard, loading, error };
}
