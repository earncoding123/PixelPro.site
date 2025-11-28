
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Use the new, correct API endpoint and key
    const externalApiUrl = 'https://earncoding-pixelperfect.hf.space/remove-background/';
    const apiKey = 'my-super-secret-key-for-my-website-12345';

    const apiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Error:', errorText);
      // Pass a more informative error to the client
      let errorMessage = `API returned status ${apiResponse.status}`;
      try {
        const jsonError = JSON.parse(errorText);
        if (jsonError.detail) {
          errorMessage = jsonError.detail;
        }
      } catch (e) {
        // Not a JSON error, use the raw text if it's short
        if (errorText.length < 100) {
            errorMessage = errorText;
        } else {
            errorMessage = `An unexpected error occurred on the server (status: ${apiResponse.status}).`;
        }
      }
      return NextResponse.json({ error: errorMessage }, { status: apiResponse.status });
    }

    const imageBlob = await apiResponse.blob();
    const headers = new Headers();
    headers.set('Content-Type', apiResponse.headers.get('Content-Type') || 'image/png');

    return new NextResponse(imageBlob, { status: 200, statusText: 'OK', headers });

  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
