import {revalidatePath} from "next/cache";
import {NextResponse} from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {path, secret} = body;

    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({message: "Invalid secret"}, {status: 401});
    }

    if (!path) {
      return NextResponse.json({message: "Path is required"}, {status: 400});
    }

    // Revalidate the specified path
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      {message: "Error revalidating", error: err.message},
      {status: 500}
    );
  }
}
