import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { url, method = 'GET', headers = {}, body } = await req.json();

        if (!url || !url.startsWith('https://api.mail.tm')) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        return NextResponse.json(responseData, { 
            status: response.status 
        });
    } catch (error: any) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
