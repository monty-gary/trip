const tools = [
  {
    name: 'dosh',
    state: 'live',
    description: 'Realtime shared expenses with tab-based rooms, balances, and settle-up suggestions.',
    localUrl: 'http://localhost:5175',
    backendUrl: 'http://localhost:3000',
    commands: ['npm run dev:dosh:backend', 'npm run dev:dosh:frontend']
  },
  {
    name: 'pack',
    state: 'mvp',
    description: 'Plan who brings what, see gaps quickly, and avoid duplicate chaos before the trip.',
    localUrl: 'http://localhost:5174',
    backendUrl: 'local state only',
    commands: ['npm run dev:pack']
  },
  {
    name: 'poll',
    state: 'planned',
    description: 'Fast one-tap group decisions for departure times, dinner, and low-stakes indecision.',
    localUrl: 'not started',
    backendUrl: 'shared foundation later',
    commands: []
  },
  {
    name: 'jest',
    state: 'planned',
    description: 'A playful bucket for social trip tools that do not deserve a full product.',
    localUrl: 'not started',
    backendUrl: 'shared foundation later',
    commands: []
  }
];

const highlights = [
  'Event-scoped, disposable tools instead of a heavy workspace.',
  'Simple monorepo: each app can mature at its own pace.',
  'Current focus: expenses and packing coordination.'
];

function App() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">trip umbrella</p>
          <h1>Tiny group tools for temporary plans and friend-group logistics.</h1>
          <p className="lede">
            This repo now runs as a real monorepo with a launcher, a migrated `dosh`, and a concrete `pack`
            direction instead of only a concept README.
          </p>
        </div>
        <div className="hero-panel">
          <h2>Current shape</h2>
          <ul>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="note">Open this app at `localhost:5173` and jump into the individual tools from here.</p>
        </div>
      </section>

      <section className="card-grid">
        {tools.map((tool) => (
          <article className="tool-card" key={tool.name}>
            <div className="tool-head">
              <h2>{tool.name}</h2>
              <span className={`status status-${tool.state}`}>{tool.state}</span>
            </div>
            <p>{tool.description}</p>
            <dl>
              <div>
                <dt>Local URL</dt>
                <dd>{tool.localUrl}</dd>
              </div>
              <div>
                <dt>Backend</dt>
                <dd>{tool.backendUrl}</dd>
              </div>
            </dl>
            {tool.commands.length > 0 ? (
              <div className="commands">
                {tool.commands.map((command) => (
                  <code key={command}>{command}</code>
                ))}
              </div>
            ) : (
              <p className="note">No runnable app yet.</p>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
