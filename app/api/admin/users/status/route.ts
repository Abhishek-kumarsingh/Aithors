import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import connectToDatabase from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

// Helper function to check admin authorization
async function checkAdminAuth(session: any) {
  if (!session || !session.user) {
    return { authorized: false, status: 401, message: "Authentication required" };
  }

  await connectToDatabase();
  const adminUser = await UserModel.findOne({ email: session.user.email });

  if (!adminUser || adminUser.role !== "admin") {
    return { authorized: false, status: 403, message: "Unauthorized: Admin access required" };
  }

  return { authorized: true, adminUser };
}

// GET real-time user status information
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authCheck = await checkAdminAuth(session);

    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.message },
        { status: authCheck.status }
      );
    }

    await connectToDatabase();

    // Get current time references
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get online users (active in last 5 minutes)
    const onlineUsers = await UserModel.find({
      lastActivity: { $gte: fiveMinutesAgo }
    }).select('name email lastActivity isOnline').sort({ lastActivity: -1 });

    // Get recently active users (active in last 24 hours but not currently online)
    const recentlyActiveUsers = await UserModel.find({
      lastActivity: { $gte: oneDayAgo, $lt: fiveMinutesAgo }
    }).select('name email lastActivity isOnline').sort({ lastActivity: -1 }).limit(20);

    // Get blocked users
    const blockedUsers = await UserModel.find({
      isBlocked: true
    }).select('name email blockedAt blockedReason').sort({ blockedAt: -1 });

    // Get user statistics by role
    const userStats = await UserModel.aggregate([
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 },
          online: {
            $sum: {
              $cond: [
                { $gte: ["$lastActivity", fiveMinutesAgo] },
                1,
                0
              ]
            }
          },
          blocked: {
            $sum: {
              $cond: ["$isBlocked", 1, 0]
            }
          }
        }
      }
    ]);

    // Get login activity for the last 24 hours
    const loginActivity = await UserModel.aggregate([
      {
        $match: {
          lastLogin: { $gte: oneDayAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d %H:00",
              date: "$lastLogin"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get device/browser statistics
    const deviceStats = await UserModel.aggregate([
      {
        $match: {
          "deviceInfo.browser": { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            browser: "$deviceInfo.browser",
            os: "$deviceInfo.os"
          },
          count: { $sum: 1 },
          online: {
            $sum: {
              $cond: [
                { $gte: ["$lastActivity", fiveMinutesAgo] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return NextResponse.json({
      timestamp: now.toISOString(),
      summary: {
        totalOnline: onlineUsers.length,
        totalRecentlyActive: recentlyActiveUsers.length,
        totalBlocked: blockedUsers.length,
        totalUsers: await UserModel.countDocuments()
      },
      users: {
        online: onlineUsers.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          lastActivity: user.lastActivity,
          isOnline: user.isOnline
        })),
        recentlyActive: recentlyActiveUsers.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          lastActivity: user.lastActivity,
          isOnline: user.isOnline
        })),
        blocked: blockedUsers.map(user => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          blockedAt: user.blockedAt,
          blockedReason: user.blockedReason
        }))
      },
      statistics: {
        byRole: userStats,
        loginActivity,
        deviceStats
      }
    });
  } catch (error: any) {
    console.error("Error fetching user status:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
