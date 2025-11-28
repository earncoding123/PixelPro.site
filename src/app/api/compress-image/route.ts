import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const quality = req.nextUrl.searchParams.get('quality') || '60';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const externalApiUrl = `https://earncoding-image-compressor-api.hf.space/compress?quality=${quality}`;
    // In a real app, this should come from environment variables.
    const apiKey = '123Lock.on';

    const apiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('External API Error:', errorText);
      return NextResponse.json({ error: `API returned status ${apiResponse.status}: ${errorText}` }, { status: apiResponse.status });
    }

    // Stream the image response directly back to the client
    const imageBlob = await apiResponse.blob();
    const headers = new Headers();
    headers.set('Content-Type', apiResponse.headers.get('Content-Type') || 'image/jpeg');
    headers.set('X-Original-Size', apiResponse.headers.get('X-Original-Size') || '0');
    headers.set('X-Compressed-Size', apiResponse.headers.get('X-Compressed-Size') || '0');
    headers.set('X-Savings-Bytes', apiResponse.headers.get('X-Savings-Bytes') || '0');

    return new NextResponse(imageBlob, { status: 200, statusText: 'OK', headers });

  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
