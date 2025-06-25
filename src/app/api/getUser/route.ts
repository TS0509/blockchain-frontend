import { db } from "@/utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ic = body.ic;

    if (!ic) {
      return NextResponse.json({ error: "Missing IC" }, { status: 400 });
    }

    const docRef = doc(db, "users", ic);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = docSnap.data();
    return NextResponse.json({ privateKey: data.privateKey }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
