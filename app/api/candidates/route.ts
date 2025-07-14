import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import CandidateModel from "@/lib/models/Candidate";
import UserModel from "@/lib/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { saveFile } from "@/lib/fileStorage";

export async function GET(req: NextRequest) {
  try {
    // Get session to check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    console.log("Looking for user with email:", session.user.email);

    // Log the session user information for debugging
    console.log("Session user:", {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });

    // Find the user by email
    let user = await UserModel.findOne({ email: session.user.email });
    console.log("User found by email:", user ? "Yes" : "No");

    if (!user) {
      // Try to find the user by ID if email fails
      console.log("Trying to find user by ID:", session.user.id);

      // Check if the ID is a valid MongoDB ObjectId
      let userById = null;
      try {
        if (mongoose.Types.ObjectId.isValid(session.user.id)) {
          userById = await UserModel.findById(session.user.id);
        }
      } catch (error) {
        console.error("Error finding user by ID:", error);
      }

      console.log("User found by ID:", userById ? "Yes" : "No");

      if (userById) {
        console.log("User found by ID:", userById.email);
        user = userById;
      } else {
        // If user is not found, create a new user record for Google-authenticated users
        if (session.user.email) {
          console.log("Creating new user for Google-authenticated account");

          try {
            // Create a new user
            const newUser = new UserModel({
              name: session.user.name || 'Google User',
              email: session.user.email,
              // Generate a random password for the user
              password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
              image: session.user.image,
              role: 'user',
            });

            // Save the user to the database
            user = await newUser.save();
            console.log("New user created with ID:", user._id.toString());

            // Return demo candidates for the new user
            return NextResponse.json([
              {
                id: "demo1",
                name: "John Doe",
                email: "john.doe@example.com",
                phone: "123-456-7890",
                role: "Frontend Developer",
                department: "Engineering",
                userId: user._id.toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              {
                id: "demo2",
                name: "Jane Smith",
                email: "jane.smith@example.com",
                phone: "987-654-3210",
                role: "Backend Developer",
                department: "Engineering",
                userId: user._id.toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]);
          } catch (error) {
            console.error("Error creating new user:", error);
          }
        }

        // Check if this is a demo user
        if (session.user.email === "admin@gmail.com" || session.user.email === "demo@example.com") {
          console.log("Creating demo candidates for demo user");

          // Return some demo candidates
          return NextResponse.json([
            {
              id: "demo1",
              name: "John Doe",
              email: "john.doe@example.com",
              phone: "123-456-7890",
              role: "Frontend Developer",
              department: "Engineering",
              userId: session.user.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: "demo2",
              name: "Jane Smith",
              email: "jane.smith@example.com",
              phone: "987-654-3210",
              role: "Backend Developer",
              department: "Engineering",
              userId: session.user.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]);
        }

        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
    }

    // Find all candidates for this user
    const candidates = await CandidateModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Transform the data to match the expected format
    const transformedCandidates = candidates.map(candidate => ({
      id: (candidate._id as mongoose.Types.ObjectId).toString(),
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      role: candidate.role,
      department: candidate.department,
      resumeUrl: candidate.resumeUrl,
      userId: (candidate.user as mongoose.Types.ObjectId).toString(),
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    }));

    return NextResponse.json(transformedCandidates);
  } catch (error: any) {
    console.error("Error in candidates API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    let user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      // Try to find the user by ID if email fails
      let userById = null;
      try {
        if (mongoose.Types.ObjectId.isValid(session.user.id)) {
          userById = await UserModel.findById(session.user.id);
        }
      } catch (error) {
        console.error("Error finding user by ID:", error);
      }

      if (userById) {
        user = userById;
      } else {
        // If user is not found, create a new user record for Google-authenticated users
        if (session.user.email) {
          try {
            // Create a new user
            const newUser = new UserModel({
              name: session.user.name || 'Google User',
              email: session.user.email,
              // Generate a random password for the user
              password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
              image: session.user.image,
              role: 'user',
            });

            // Save the user to the database
            user = await newUser.save();
          } catch (error) {
            console.error("Error creating new user:", error);
            return NextResponse.json(
              { error: "Failed to create user account" },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: "User not found and cannot create new user without email" },
            { status: 404 }
          );
        }
      }
    }

    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    let candidateData: any;
    let resumeUrl: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await req.formData();
      
      // Extract form fields
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const role = formData.get('role') as string;
      const department = formData.get('department') as string;
      const resumeFile = formData.get('resume') as File;

      // Validate required fields
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      candidateData = { name, email, phone, role, department };

      // Process resume file if provided
      if (resumeFile && resumeFile.size > 0) {
        try {
          // Convert file to buffer
          const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
          
          // Save the file and get the URL
          resumeUrl = await saveFile(fileBuffer, resumeFile.name);
        } catch (error) {
          console.error("Error processing resume file:", error);
          return NextResponse.json(
            { error: "Failed to process resume file" },
            { status: 500 }
          );
        }
      }
    } else {
      // Handle JSON data without file upload
      const body = await req.json();
      const { name, email, phone, role, department } = body;

      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      candidateData = { name, email, phone, role, department };
    }

    // Create a new candidate
    const candidate = new CandidateModel({
      ...candidateData,
      resumeUrl,
      user: user._id
    });

    // Save the candidate
    await candidate.save();

    // Return the created candidate
    return NextResponse.json({
      id: (candidate._id as mongoose.Types.ObjectId).toString(),
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      role: candidate.role,
      department: candidate.department,
      resumeUrl: candidate.resumeUrl,
      userId: (candidate.user as mongoose.Types.ObjectId).toString(),
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error in candidates API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
