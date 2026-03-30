import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(
    request: NextRequest,
    segmentData: { params: Params }
) {
    try {
        // Next.js 15 requires awaiting params
        const { id } = await segmentData.params;
        
        // Extract the action query parameter (?action=view or ?action=download)
        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get("action") || "view";

        // Define your backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;

        // Optional: Extract auth token from cookies if your backend requires authentication
        // const token = request.cookies.get("session_token")?.value;

        // Fetch the PDF from your Node.js backend
        const res = await fetch(`${backendUrl}/orders/${id}/pdf`, {
            method: "GET",
            headers: {
                // "Authorization": `Bearer ${token}`, // Uncomment if auth is required
            },
            cache: "no-store", // Ensures the PDF is always freshly generated
        });

        if (!res.ok) {
            return new NextResponse("Failed to generate PDF document", { status: res.status });
        }

        // Convert the response stream into a Buffer
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine whether the browser should open it in a tab or download it directly
        const disposition = action === "download" ? "attachment" : "inline";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `${disposition}; filename="Order-${id}.pdf"`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (error) {
        console.error("[PDF_PROXY_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}