"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Crown, User } from "lucide-react";
import DashboardLayout from '@/components/layout/DashboardLayout';

interface UserProgressDto {
  userId: number;
  name: string;
  progressPercent: number;
}

const getCrownColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-gray-300";
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<UserProgressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const res = await axios.get("https://api-shepherd.jar-vis.com/api/v1/summa-logos/users-progress", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setUsers(
          res.data.data.sort(
            (a: UserProgressDto, b: UserProgressDto) =>
              b.progressPercent - a.progressPercent
          )
        );
      } catch (err: any) {
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-primary mb-8">Leaderboard</h1>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <ol className="space-y-6">
                {users.map((user, idx) => (
                  <li
                    key={user.userId}
                    className={`grid grid-cols-[180px_200px_auto] items-center gap-[12px_24px] p-4 rounded-xl transition-all duration-200 min-h-[64px] ${
                      idx === 0
                        ? "bg-yellow-50 border-2 border-yellow-300 shadow-lg"
                        : idx === 1
                        ? "bg-gray-50 border border-gray-200"
                        : idx === 2
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-4 w-[180px] min-w-0">
                      <div className="flex flex-col items-center justify-center min-h-[48px] w-12 relative">
                        {idx < 3 && (
                          <Crown
                            className={`absolute -top-5 left-1/2 -translate-x-1/2 h-5 w-5 ${getCrownColor(idx + 1)}`}
                          />
                        )}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xl font-bold shadow">
                          <User className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="truncate text-lg font-semibold text-gray-900 min-w-0">
                        {user.name}
                        <div className="text-xs text-gray-500">Rank #{idx + 1}</div>
                      </div>
                    </div>
                    <div style={{ width: 200 }} className="mr-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary to-blue-400 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${user.progressPercent}%`,
                            minWidth: user.progressPercent > 0 && user.progressPercent < 2 ? '2%' : undefined,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary tabular-nums min-w-[60px] text-right">
                      {user.progressPercent.toFixed(1)}%
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 