import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const CONTROLLER_URL = process.env.NEXT_PUBLIC_CONTROLLER_URL || 'http://192.168.30.20:3000';
    const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'c8dc1db2d58ed837884a119a3d48575aeabc8f09fa541e14ee5aa2103b5b7efb';

    try {
        const response = await fetch(`${CONTROLLER_URL}/servers/${id}/metrics`, {
            headers: {
                'x-internal-secret': INTERNAL_SECRET
            }
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch telemetry" }, { status: 500 });
    }
}
