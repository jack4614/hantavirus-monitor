import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Hantavirus Updates';
    const category = searchParams.get('category') || 'Breaking News';

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: '#1a1a1a',
            color: '#f0f0f0',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            position: 'relative',
            fontFamily: 'system-ui, -apple-system',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: '#c0392b',
              width: '100%',
            }}
          />

          <div
            style={{
              background: '#c0392b',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '4px',
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 30,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {category}
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              margin: '0 0 40px 0',
              lineHeight: 1.2,
              maxWidth: '1000px',
              color: '#f0f0f0',
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 'auto',
              fontSize: 28,
              color: '#999',
              borderTop: '1px solid #333',
              paddingTop: '20px',
              width: '100%',
            }}
          >
            Hantavirus Updates • Outbreak Monitoring
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
