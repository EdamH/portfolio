import { ImageResponse } from 'next/og'

export const alt = 'Edam Hamza — GenAI Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#09090b',
          borderTop: '4px solid #c9a96e',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Edam Hamza
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: '#c9a96e',
            fontFamily: 'system-ui, sans-serif',
            marginBottom: 20,
          }}
        >
          GenAI Engineer
        </div>

        {/* One-liner */}
        <div
          style={{
            fontSize: 24,
            color: '#a1a1aa',
            fontFamily: 'system-ui, sans-serif',
            marginBottom: 60,
          }}
        >
          Building production AI systems end-to-end
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 16,
            color: '#c9a96e',
            fontFamily: 'ui-monospace, monospace',
            position: 'absolute',
            bottom: 48,
          }}
        >
          <span>12 agents</span>
          <span style={{ color: '#3f3f46' }}>·</span>
          <span>78K LOC</span>
          <span style={{ color: '#3f3f46' }}>·</span>
          <span>145+ tests</span>
          <span style={{ color: '#3f3f46' }}>·</span>
          <span>925+ commits</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
