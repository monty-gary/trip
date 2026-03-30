const apps = [
  {
    name: 'pack',
    state: 'live' as const,
    description: 'Group packing coordination — who brings what, what is still missing.',
    url: '/trip/',
  },
  {
    name: 'dosh',
    state: 'live' as const,
    description: 'Realtime shared expenses with tab-based rooms, balances, and settle-up.',
    url: null,
  },
  {
    name: 'poll',
    state: 'planned' as const,
    description: 'Fast one-tap group decisions for departure times, dinner, and low-stakes indecision.',
    url: null,
  },
  {
    name: 'jest',
    state: 'planned' as const,
    description: 'A playful bucket for social trip tools that do not deserve a full product.',
    url: null,
  }
];

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">trip</p>
          <h1>Tiny group tools for trips and temporary plans.</h1>
          <p className="lede">
            Event-scoped, disposable tools for friend-group logistics. No accounts, no overhead — just open and go.
          </p>
        </div>
        <div className="hero-panel">
          <h2>What is this?</h2>
          <ul>
            <li>Small focused apps instead of one heavy product.</li>
            <li>Each tool solves one group coordination problem.</li>
            <li>Currently: packing lists and shared expenses.</li>
          </ul>
        </div>
      </section>

      <section className="card-grid">
        {apps.map((app) => (
          <article className="tool-card" key={app.name}>
            <div className="tool-head">
              <h2>{app.name}</h2>
              <span className={`status status-${app.state}`}>{app.state}</span>
            </div>
            <p>{app.description}</p>
            {app.url ? (
              <a className="app-link" href={app.url}>
                Open {app.name} →
              </a>
            ) : (
              <p className="note">{app.state === 'live' ? 'Hosted separately' : 'Coming later'}</p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
