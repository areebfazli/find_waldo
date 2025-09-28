import { NextResponse } from "next/server";

// Forward GET requests to the backend
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  // Define the backend URL. You might want to use an environment variable for this in a real app.
  const backendUrl = new URL("http://127.0.0.1:8000/search");

  // The natural language search endpoint is a POST request
  const requestBody = {
    prompt: q || "", // Ensure prompt is not null
    limit: 50
  };

  try {
    // Make the POST request to the backend
    const resp = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!resp.ok) {
      const errorBody = await resp.text();
      console.error("Backend error response:", errorBody);
      throw new Error(`Backend error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();

    // The frontend DataTable expects a simple array of results
    return NextResponse.json(data.results);

  } catch (e) {
    const err = e as Error;
    console.error("Could not fetch from backend:", err.message);
    // Return an error response to the client
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
