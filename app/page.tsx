import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>TaskFlow</h1>

      <Link href="/board">
        <button
          style={{
            padding: '10px 20px',
            background: 'black',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Enter Board
        </button>
      </Link>
    </div>
  )
}
