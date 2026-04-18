/* File: frontend/app/api/sales/[id]/ticket/route.ts 
    @Author: whramos 
    @Description: Secure proxy Route Handler to stream PDF tickets from backend.
    Optimized for Next.js 15 (Async Params).
*/

import { NextResponse } from "next/server";
import getToken from "@/src/auth/token";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const token = await getToken();
    const API_URL = process.env.API_URL;

    if (!API_URL) {
      console.error("[TICKET_ERROR] API_URL is not defined in environment variables");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const backendUrl = `${API_URL}/sales/v2/${id}/ticket`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/pdf",
      },
      cache: 'no-store'
    });
    if (!response.ok) {
      const status = response.status;
      console.error(`[TICKET_ERROR] Backend returned ${status} for ID: ${id}`);

      return NextResponse.json(
        { error: "The ticket could not be generated on the server" },
        { status }
      );
    }
    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        // 'inline' allows the browser to open it directly; 'attachment' forces download
        "Content-Disposition": `inline; filename="ticket-${id}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[TICKET_CRITICAL_ERROR] ID: ${id} | Message: ${errorMessage}`);

    return NextResponse.json(
      { error: "Internal server error while processing ticket request" },
      { status: 500 }
    );
  }
}