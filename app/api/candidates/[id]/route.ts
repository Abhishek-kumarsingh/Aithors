import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import CandidateModel from "@/lib/models/Candidate";
import UserModel from "@/lib/models/User";
import mongoose from "mongoose";
import { saveFile, deleteFile } from "@/lib/fileStorage";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the user
    const user = await UserModel.findOne({ email: session.user.email }) || 
                 (mongoose.Types.ObjectId.isValid(session.user.id) ? 
                  await UserModel.findById(session.user.id) : null);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    // Find the candidate
    const candidate = await CandidateModel.findOne({
      _id: params.id,
      user: user._id
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Return the candidate
    return NextResponse.json({
      id: candidate._id.toString(),
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      role: candidate.role,
      department: candidate.department,
      resumeUrl: candidate.resumeUrl,
      userId: candidate.user.toString(),
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    });
  } catch (error: any) {
    console.error("Error in candidate API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the user
    const user = await UserModel.findOne({ email: session.user.email }) || 
                 (mongoose.Types.ObjectId.isValid(session.user.id) ? 
                  await UserModel.findById(session.user.id) : null);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    // Find the candidate
    const candidate = await CandidateModel.findOne({
      _id: params.id,
      user: user._id
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    let candidateData: any;
    let resumeUrl: string | undefined = candidate.resumeUrl;

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
      const removeResume = formData.get('removeResume') === 'true';

      // Validate required fields
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      candidateData = { name, email, phone, role, department };

      // Handle resume file
      if (resumeFile && resumeFile.size > 0) {
        try {
          // Delete old resume if exists
          if (candidate.resumeUrl) {
            await deleteFile(candidate.resumeUrl);
          }
          
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
      } else if (removeResume && candidate.resumeUrl) {
        // Remove the resume if requested
        await deleteFile(candidate.resumeUrl);
        resumeUrl = undefined;
      }
    } else {
      // Handle JSON data without file upload
      const body = await req.json();
      const { name, email, phone, role, department, removeResume } = body;

      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      candidateData = { name, email, phone, role, department };

      // Handle resume removal if requested
      if (removeResume && candidate.resumeUrl) {
        await deleteFile(candidate.resumeUrl);
        resumeUrl = undefined;
      }
    }

    // Update the candidate
    Object.assign(candidate, candidateData);
    candidate.resumeUrl = resumeUrl;
    await candidate.save();

    // Return the updated candidate
    return NextResponse.json({
      id: candidate._id.toString(),
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      role: candidate.role,
      department: candidate.department,
      resumeUrl: candidate.resumeUrl,
      userId: candidate.user.toString(),
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt
    });
  } catch (error: any) {
    console.error("Error in candidate API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the user
    const user = await UserModel.findOne({ email: session.user.email }) || 
                 (mongoose.Types.ObjectId.isValid(session.user.id) ? 
                  await UserModel.findById(session.user.id) : null);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    // Find the candidate
    const candidate = await CandidateModel.findOne({
      _id: params.id,
      user: user._id
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Delete the resume file if it exists
    if (candidate.resumeUrl) {
      await deleteFile(candidate.resumeUrl);
    }

    // Delete the candidate
    await CandidateModel.deleteOne({ _id: params.id });

    // Return success
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in candidate API route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
