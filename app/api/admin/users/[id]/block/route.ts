import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import connectToDatabase from "@/lib/mongodb";
import UserModel from "@/lib/models/User";
import ActivityLogModel from "@/lib/models/ActivityLog";

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

// Helper function to log activity
async function logActivity(
  userId: string,
  adminUserId: string,
  action: string,
  description: string,
  metadata: any = {},
  req: NextRequest
) {
  try {
    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    await ActivityLogModel.create({
      userId: adminUserId,
      action,
      description,
      category: 'admin',
      metadata: {
        ...metadata,
        targetUserId: userId,
        ip,
        userAgent
      },
      severity: 'medium',
      status: 'success'
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// POST to block a user
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const authCheck = await checkAdminAuth(session);

    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.message },
        { status: authCheck.status }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { reason = "No reason provided" } = body;

    await connectToDatabase();

    // Find the user to block
    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent blocking admin users
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot block admin users" },
        { status: 400 }
      );
    }

    // Check if user is already blocked
    if (user.isBlocked) {
      return NextResponse.json(
        { error: "User is already blocked" },
        { status: 400 }
      );
    }

    // Block the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
        blockedAt: new Date(),
        blockedBy: authCheck.adminUser._id,
        blockedReason: reason,
        isOnline: false // Force offline when blocked
      },
      { new: true }
    ).select("-password");

    // Log the activity
    await logActivity(
      id,
      authCheck.adminUser._id.toString(),
      'user_block',
      `Blocked user ${user.name} (${user.email})`,
      { reason, oldValue: { isBlocked: false }, newValue: { isBlocked: true } },
      req
    );

    return NextResponse.json({
      message: "User blocked successfully",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        isBlocked: updatedUser.isBlocked,
        blockedAt: updatedUser.blockedAt,
        blockedReason: updatedUser.blockedReason
      }
    });
  } catch (error: any) {
    console.error("Error blocking user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE to unblock a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const authCheck = await checkAdminAuth(session);

    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.message },
        { status: authCheck.status }
      );
    }

    const { id } = params;

    await connectToDatabase();

    // Find the user to unblock
    const user = await UserModel.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is actually blocked
    if (!user.isBlocked) {
      return NextResponse.json(
        { error: "User is not blocked" },
        { status: 400 }
      );
    }

    // Unblock the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
        blockedAt: null,
        blockedBy: null,
        blockedReason: null
      },
      { new: true }
    ).select("-password");

    // Log the activity
    await logActivity(
      id,
      authCheck.adminUser._id.toString(),
      'user_unblock',
      `Unblocked user ${user.name} (${user.email})`,
      { oldValue: { isBlocked: true }, newValue: { isBlocked: false } },
      req
    );

    return NextResponse.json({
      message: "User unblocked successfully",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        isBlocked: updatedUser.isBlocked
      }
    });
  } catch (error: any) {
    console.error("Error unblocking user:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
