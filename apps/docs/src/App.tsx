import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, Box, Check, CheckCheck, ChevronRight, CircleHelp, Code2, Command, Component, Copy, FileCode2, Layers, LayoutGrid, Menu as MenuIcon, Moon, MoreHorizontal, MousePointer2, Palette, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Terminal, Workflow, X, Zap } from 'lucide-react';
import { Badge, Button, Card, Input, Menu, Select, Switch, Tabs } from '@virtuui/react';
import { catalog, guidelines, type ComponentDoc } from '@virtuui/governance/catalog';
import { flattenTokens, tokens } from '@virtuui/tokens';

type Page = 'components' | 'tokens' | 'guidelines' | 'setup' | 'mcp';
const icons: Record<string, typeof Box> = { Button: MousePointer2, Input: FileCode2, Select: SlidersHorizontal, Switch: Settings2, Tabs: Layers, Menu: MenuIcon, Badge: CheckCheck, Card: LayoutGrid };
const categories = ['All components', 'Actions', 'Forms', 'Navigation', 'Data display'];

function Mark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark ${small ? 'brand-mark--small' : ''}`}><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="m9 12 11 18 11-18M15 12l5 9 5-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
}

function Demo({ name, notify }: { name: string; notify: (message: string) => void }) {
  switch (name) {
    case 'Button': return <div className="demo-buttons"><div className="row"><Button onClick={() => notify('Your changes have been saved.')} startIcon={<Plus size={14} />}>Create project</Button><Button variant="secondary" onClick={() => notify('Secondary action activated.')}>Secondary</Button></div><div className="row"><Button variant="ghost" size="sm" onClick={() => notify('Ghost action activated.')}>Ghost button <ArrowUpRight size={13} /></Button><Button size="sm" disabled>Disabled</Button></div></div>;
    case 'Input': return <div className="demo-form"><Input label="Email address" type="email" placeholder="you@example.com" hint="We'll only send the good stuff." /></div>;
    case 'Select': return <div className="demo-form"><Select label="Your framework" defaultValue="react" onValueChange={(value) => notify(`Selected ${value}`)} options={[{ value: 'react', label: 'React' }, { value: 'next', label: 'Next.js' }, { value: 'remix', label: 'Remix' }, { value: 'soon', label: 'More coming soon', disabled: true }]} /><span className="demo-caption">A little less searching. A little more finding.</span></div>;
    case 'Switch': return <div className="switch-demo"><Switch label="Email notifications" defaultChecked /><Switch label="Marketing updates" /><Switch label="Security alerts" defaultChecked disabled /></div>;
    case 'Tabs': return <Tabs label="Example project" items={[{ value: 'overview', label: 'Overview', content: <div className="tab-demo-content"><span className="mini-icon"><Layers size={16} /></span><div><strong>Everything in its place.</strong><p>A fresh perspective on your project.</p></div></div> }, { value: 'activity', label: 'Activity', content: <p className="tab-copy">Your project was created just now. You're all set to start building.</p> }, { value: 'settings', label: 'Settings', content: <Switch label="Make project public" /> }]} />;
    case 'Menu': return <div className="menu-demo"><div className="file-icon"><FileCode2 size={27} strokeWidth={1.3} /></div><div className="file-details"><strong>brand-guidelines.fig</strong><span>Updated just now</span></div><Menu label="Actions" align="end" items={[{ value: 'edit', label: 'Edit file', icon: <FileCode2 size={14} /> }, { value: 'duplicate', label: 'Duplicate', icon: <Copy size={14} /> }, { value: 'archive', label: 'Archive', icon: <ArrowDownToLine size={14} /> }, { value: 'delete', label: 'Delete file', danger: true, disabled: true }]} onAction={(value) => notify(`Demo action: ${value}. No files were changed.`)} /></div>;
    case 'Badge': return <div className="badge-demo"><div className="row"><Badge dot variant="success">Published</Badge><Badge dot>Draft</Badge><Badge dot variant="danger">Needs review</Badge></div><div className="row"><Badge>Design</Badge><Badge>Engineering</Badge><Badge variant="success">v0.1.0</Badge></div></div>;
    case 'Card': return <Card className="nested-card"><span className="mini-icon"><Layers size={18} /></span><div><strong>A space for your ideas</strong><p>Something great starts here.</p></div><ArrowUpRight size={17} /></Card>;
    default: return null;
  }
}

function ComponentCard({ component, notify, onOpen }: { component: ComponentDoc; notify: (message: string) => void; onOpen: () => void }) {
  const [code, setCode] = useState(false);
  const Icon = icons[component.name] ?? Box;
  return <article className="component-card">
    <div className="component-card-heading"><button className="component-title" onClick={onOpen}><span className="component-icon"><Icon size={16} /></span>{component.name}<ArrowUpRight size={13} className="title-arrow" /></button><Badge variant="success">Stable</Badge></div>
    <p className="component-description">{component.description.split('.')[0]}.</p>
    <div className={`component-preview ${code ? 'component-preview--code' : ''}`}>{code ? <pre><code>{`import { ${component.name} } from '@virtuui/react';\n\n${component.example}`}</code></pre> : <Demo name={component.name} notify={notify} />}</div>
    <div className="component-card-footer"><div className="preview-switch" aria-label={`${component.name} example view`}><button aria-pressed={!code} onClick={() => setCode(false)}><LayoutGrid size={12} />Preview</button><button aria-pressed={code} onClick={() => setCode(true)}><Code2 size={13} />Code</button></div><button className="icon-button" aria-label={`View ${component.name} documentation`} onClick={onOpen}><ArrowUpRight size={15} /></button></div>
  </article>;
}

function CodeBlock({ children, copy }: { children: string; copy: (value: string) => void }) {
  return <div className="code-block"><pre><code>{children}</code></pre><button className="icon-button" onClick={() => copy(children)} aria-label="Copy code"><Copy size={15} /></button></div>;
}

function ComponentDetail({ component, notify, copy, back }: { component: ComponentDoc; notify: (value: string) => void; copy: (value: string) => void; back: () => void }) {
  return <div className="detail-page"><button className="text-link" onClick={back}>← All components</button><div className="page-heading"><div><span className="eyebrow">{component.category}</span><h1>{component.name}<Badge variant="success">Stable</Badge></h1><p>{component.description}</p></div></div>
    <div className="detail-demo"><Demo name={component.name} notify={notify} /></div><h2>Usage</h2><CodeBlock copy={copy}>{`import { ${component.name} } from '@virtuui/react';\nimport '@virtuui/react/styles.css';\n\n${component.example}`}</CodeBlock>
    <h2>API reference</h2><div className="table-scroll"><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>{component.props.map((prop) => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td>{prop.default ?? '—'}</td><td>{prop.description}</td></tr>)}</tbody></table></div>
    <h2>Accessibility & behavior</h2><div className="note-card">{component.accessibility.map((note) => <p key={note}><ShieldCheck size={16} />{note}</p>)}</div>
    <p className="muted">Button, Input, Select and Switch forward refs and accept native element attributes. Read the TypeScript definitions for the complete contract.</p>
  </div>;
}

export function App() {
  const initialHash = window.location.hash.slice(1);
  const [page, setPage] = useState<Page>(['tokens', 'guidelines', 'setup', 'mcp'].includes(initialHash) ? initialHash as Page : 'components');
  const [category, setCategory] = useState('All components');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(catalog.some((component) => component.name === initialHash) ? initialHash : null);
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('virtuui-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } });
  const [mobileNav, setMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const [toast, setToast] = useState('');
  const [compact, setCompact] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const navTrigger = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function notify(message: string) { setToast(message); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 3500); }
  async function copy(value: string) { try { await navigator.clipboard.writeText(value); notify('Copied to clipboard.'); } catch { notify('Clipboard is unavailable. Select and copy the code manually.'); } }
  function navigate(next: Page, component: string | null = null) { setPage(next); setSelected(component); setMobileNav(false); window.location.hash = component ?? next; window.scrollTo({ top: 0, behavior: 'instant' }); }
  useEffect(() => {
    document.documentElement.dataset.vuiTheme = theme;
    try { localStorage.setItem('virtuui-theme', theme); } catch { /* Storage may be disabled by browser policy. */ }
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => { setIsMobile(media.matches); if (!media.matches) setMobileNav(false); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!isMobile || !mobileNav) return;
    const trigger = navTrigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebar.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const controls = sidebar.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!controls?.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trapFocus);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', trapFocus); trigger?.focus(); };
  }, [isMobile, mobileNav]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); search.current?.focus(); } if (event.key === 'Escape') setMobileNav(false); };
    const hashHandler = () => { const hash = window.location.hash.slice(1); if (catalog.some((component) => component.name === hash)) { setSelected(hash); setPage('components'); } else { setSelected(null); setPage(['tokens', 'guidelines', 'setup', 'mcp'].includes(hash) ? hash as Page : 'components'); } };
    window.addEventListener('keydown', handler); window.addEventListener('hashchange', hashHandler);
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('hashchange', hashHandler); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);
  const visible = catalog.filter((component) => (category === 'All components' || component.category === category) && `${component.name} ${component.description} ${component.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const current = catalog.find((component) => component.name === selected);
  const pageNames: Record<Page, string> = { components: 'Components', tokens: 'Design tokens', guidelines: 'Guidelines', setup: 'Getting started', mcp: 'AI & MCP' };
  const nav = (target: Page, label: string, icon: ReactNode, extra?: ReactNode) => <button className={`nav-item ${page === target ? 'active' : ''}`} onClick={() => { setQuery(''); setCategory('All components'); navigate(target); }}>{icon}<span>{label}</span>{extra}</button>;
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {mobileNav && <button className="nav-overlay" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <aside ref={sidebar} inert={isMobile && !mobileNav} className={`sidebar ${mobileNav ? 'sidebar--open' : ''}`} aria-label="Main navigation">
      <button className="brand" onClick={() => navigate('components')}><Mark /><span>Virtu<span className="brand-light">UI</span><small>Build with intention.</small></span></button>
      <button className="workspace-select" onClick={() => navigate('setup')}><span className="workspace-avatar"><Component size={16} /></span><span>Design system<small>React component library</small></span><MoreHorizontal size={15} /></button>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav('setup', 'Getting started', <BookOpen size={17} />)}{nav('components', 'Components', <LayoutGrid size={17} />, <span className="nav-count">08</span>)}{nav('tokens', 'Design tokens', <Palette size={17} />)}{nav('guidelines', 'Guidelines', <ShieldCheck size={17} />)}{nav('mcp', 'AI & MCP', <Sparkles size={17} />, <span className="new-label">NEW</span>)}</nav>
      <div className="nav-label nav-label--components">COMPONENTS <span>{catalog.length}</span></div>
      <nav className="component-nav">{catalog.map((component) => { const Icon = icons[component.name] ?? Box; return <button key={component.name} className={`nav-item ${selected === component.name ? 'selected' : ''}`} onClick={() => navigate('components', component.name)}><Icon size={15} /><span>{component.name}</span><span className="nav-dot" /></button>; })}</nav>
      <div className="sidebar-bottom"><div className="ai-card"><span className="ai-card-icon"><Sparkles size={17} /></span><strong>Your AI, on the same page.</strong><p>Give your assistant the context<br />to build it right.</p><button onClick={() => navigate('mcp')}>Explore MCP integration <ArrowUpRight size={13} /></button></div><button className="sidebar-help" onClick={() => navigate('guidelines')}><CircleHelp size={16} /><span>Documentation & support</span><ArrowUpRight size={13} /></button><div className="sidebar-credit"><Mark small /><span>Made for the details.</span><span>v0.1</span></div></div>
    </aside>
    <div className="main-shell" inert={isMobile && mobileNav}><header className="topbar"><div className="breadcrumbs"><button ref={navTrigger} className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={mobileNav} onClick={() => setMobileNav(true)}><MenuIcon size={18} /></button><span>Workspace</span><ChevronRight size={12} /><strong>{pageNames[page]}</strong>{current && <><ChevronRight size={12} /><strong>{current.name}</strong></>}</div><div className="topbar-actions"><label className="global-search"><Search size={15} /><input ref={search} placeholder="Search components..." aria-label="Search components" value={query} onChange={(event) => { setQuery(event.target.value); setCategory('All components'); if (page !== 'components' || selected) navigate('components'); }} /><kbd><Command size={10} /> K</kbd></label><span className="topbar-divider" /><button className="icon-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button><button className="version-button" onClick={() => navigate('setup')}>v0.1.0 <span /></button></div></header>
      <main id="main-content" tabIndex={-1}>
        {current && page === 'components' ? <ComponentDetail component={current} notify={notify} copy={copy} back={() => navigate('components')} /> : page === 'components' ? <>
          <div className="page-heading"><div><div className="eyebrow"><span />THE BUILDING BLOCKS</div><h1>Good interfaces start here<span className="heading-period">.</span></h1><p>Thoughtful components. Consistent experiences. More room to create.</p></div><Button variant="secondary" onClick={() => navigate('setup')}><BookOpen size={15} />Quick start<ArrowUpRight size={14} /></Button></div>
          <section className="intro-banner"><div className="intro-copy"><Badge variant="success"><span className="tiny-spark">✦</span> SMALL DETAILS. BIG DIFFERENCE.</Badge><h2>Less rebuilding.<br />More <span>possibility.</span></h2><p>Accessible, composable React components.<br />A shared foundation for whatever comes next.</p><button className="text-link" onClick={() => navigate('guidelines')}>Meet your design system <ArrowRight size={14} /></button></div><div className="banner-art" aria-hidden="true"><div className="art-grid" /><div className="art-window art-window-back"><div className="art-dots"><i /><i /><i /></div><div className="art-line" /><div className="art-line short" /></div><div className="art-window art-window-front"><div className="art-mini-title"><span /><div /><MoreHorizontal size={13} /></div><div className="art-blocks"><div /><div /><div /></div><div className="art-bottom"><div /><span><Check size={11} /></span></div></div><div className="floating-token"><Palette size={14} /><span>Made to be yours</span></div><div className="floating-code"><Code2 size={17} /></div><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">+</span></div></section>
          <div className="feature-strip"><span><ShieldCheck size={15} />Accessibility first</span><span><Code2 size={15} />TypeScript native</span><span><Box size={15} />Tree-shakeable</span><span><Sparkles size={15} />AI-ready by design</span><button onClick={() => navigate('setup')}>Built for React <ArrowUpRight size={12} /></button></div>
          <section className="collection" aria-labelledby="collection-title"><div className="collection-heading"><div><h2 id="collection-title">Explore the collection <span>{catalog.length}</span></h2><p>Small pieces. Endless combinations.</p></div><button className={`density-button ${compact ? 'is-active' : ''}`} aria-label={compact ? "Comfortable view" : "Compact view"} aria-pressed={compact} onClick={() => setCompact(!compact)}><SlidersHorizontal size={14} /><span>{compact ? 'Comfortable view' : 'Compact view'}</span></button></div><div className="collection-toolbar"><div className="category-tabs" aria-label="Component categories">{categories.map((item) => <button key={item} aria-pressed={item === category} className={item === category ? 'active' : ''} onClick={() => setCategory(item)}>{item}{item === 'All components' && <span>{catalog.length}</span>}</button>)}</div><span className="result-count">{visible.length} components</span></div>
          <div className={`component-grid ${compact ? 'component-grid--compact' : ''}`}>{visible.map((component) => <ComponentCard key={component.name} component={component} notify={notify} onOpen={() => navigate('components', component.name)} />)}</div>{visible.length === 0 && <div className="empty-state"><Search size={28} /><h3>No components found</h3><p>Try a different name or reset your filters.</p><Button variant="secondary" onClick={() => { setQuery(''); setCategory('All components'); }}>Clear filters</Button></div>}</section>
          <div className="bottom-callout"><span className="mini-icon"><Workflow size={20} /></span><div><strong>One system. A shared language.</strong><p>From your first component to your AI assistant — keep everyone in sync.</p></div><button className="text-link" onClick={() => navigate('mcp')}>Explore the workflow <ArrowRight size={14} /></button></div>
        </> : page === 'tokens' ? <><PageHeading eyebrow="THE FOUNDATION" title="A shared visual language." description="One source of truth, from CSS variables to AI context." /><div className="note-card token-note"><Palette size={20} /><p>Tokens power every component. Switch the theme in the toolbar to explore light and dark palettes. Click a token to copy its CSS variable.</p></div>{Object.entries(tokens).map(([group, values]) => <section className="token-section" key={group}><h2>{group}<Badge>{Object.keys(values).length} tokens</Badge></h2><div className="token-grid">{Object.entries(values).map(([name, value]) => { const key = `--vui-${group}-${name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`; return <button key={name} className="token-card" onClick={() => copy(`var(${key})`)}>{group === 'color' ? <span className="color-swatch" style={{ background: `var(${key})` }} /> : group === 'space' ? <span className="space-swatch"><i style={{ width: value }} /></span> : group === 'radius' ? <span className="radius-swatch" style={{ borderRadius: value }} /> : <span className="text-swatch">{group === 'font' ? 'Aa' : '↗'}</span>}<strong>{name}</strong><code>{value}</code><Copy size={12} /></button>; })}</div></section>)}<CodeBlock copy={copy}>{`:root {\n  /* Override a semantic token to customize your brand. */\n  --vui-color-accent: #52734d;\n}\n\n/* ${Object.keys(flattenTokens()).length} shared variables, exported by @virtuui/tokens */`}</CodeBlock></> : page === 'setup' ? <><PageHeading eyebrow="WELCOME TO VIRTUUI" title="A good place to start." description="From an empty canvas to your first component in a few minutes." /><div className="setup-layout"><section><h2>01 <span>Run this workspace</span></h2><p>Use Node.js 22.12+ and pnpm 10. Install dependencies, build packages, then open the development app.</p><CodeBlock copy={copy}>{'pnpm install\npnpm build\npnpm dev\n\n# Component stories\npnpm storybook'}</CodeBlock><h2>02 <span>Add your first component</span></h2><p>Workspace packages resolve locally. After you publish the packages to your registry, install them with your package manager.</p><CodeBlock copy={copy}>{`import { Button, Input } from '@virtuui/react';\nimport '@virtuui/react/styles.css';\n\nexport function Welcome() {\n  return (\n    <form onSubmit={(event) => event.preventDefault()}>\n      <Input label="Your name" name="name" required />\n      <Button type="submit">Get started</Button>\n    </form>\n  );\n}`}</CodeBlock><h2>03 <span>Import only what you need</span></h2><CodeBlock copy={copy}>{`import { Button } from '@virtuui/react/button';\nimport '@virtuui/react/styles.css';`}</CodeBlock></section><aside className="setup-aside"><Card><Box size={22} /><h3>A small, connected workspace</h3>{['@virtuui/react', '@virtuui/hooks', '@virtuui/tokens', '@virtuui/governance', '@virtuui/mcp'].map((name) => <code key={name}>{name}</code>)}</Card><Card><Zap size={22} /><h3>Release 0.1.0</h3><p>Eight components, light and dark themes, keyboard interactions, Storybook, Jest and a local MCP service.</p><Badge variant="success" dot>Initial release</Badge></Card></aside></div></> : page === 'guidelines' ? <><PageHeading eyebrow="BUILT WITH INTENTION" title="Consistency is a team sport." description="A few shared principles make every contribution fit." /><div className="guideline-grid">{guidelines.map((rule, index) => <Card key={rule}><span className="rule-number">0{index + 1}</span><h3>{['Compose with confidence', 'Speak the same visual language', 'Own your state', 'Make room for everyone', 'Keep identity stable', 'Respect package boundaries', 'Ship with evidence'][index]}</h3><p>{rule}</p></Card>)}</div><h2>Quality workflow</h2><CodeBlock copy={copy}>{'pnpm lint\npnpm typecheck\npnpm test:coverage\npnpm build\npnpm test:artifacts\npnpm build:storybook\npnpm changeset'}</CodeBlock><p className="muted">For issues, include a minimal reproduction, expected behavior, browser version and keyboard steps in your repository issue tracker.</p></> : <><PageHeading eyebrow="CONTEXT FOR YOUR COPILOT" title="Your system. AI fluent." description="Give your assistant the same documentation, tokens and conventions as your team." /><div className="mcp-banner"><span className="mcp-icon"><Sparkles size={30} /></span><div><Badge variant="success">MODEL CONTEXT PROTOCOL</Badge><h2>Less guessing. Better building.</h2><p>A local stdio server. Read-only resources. Practical, structured tools.</p></div></div><div className="guideline-grid">{[['recommend_components', 'Find a component from English or Chinese requirements.'], ['get_component_docs', 'Read typed APIs, examples and accessibility contracts.'], ['get_design_tokens', 'Get canonical variables and light/dark palettes.'], ['check_code', 'Analyze TSX for state conflicts, unknown tokens and risks.']].map(([name, description]) => <Card key={name}><Terminal size={18} /><h3><code>{name}</code></h3><p>{description}</p></Card>)}</div><h2>Connect your MCP client</h2><p>Build the workspace, then replace the path below with this repository’s absolute path in your client configuration.</p><CodeBlock copy={copy}>{JSON.stringify({ mcpServers: { virtuui: { command: 'node', args: ['/absolute/path/to/VirtualUI/packages/mcp/dist/index.js'] } } }, null, 2)}</CodeBlock><h2>Resources</h2><CodeBlock copy={copy}>{'virtuui://components\nvirtuui://tokens\nvirtuui://guidelines'}</CodeBlock><div className="note-card"><p><ShieldCheck size={18} />The checker never executes submitted code or reads your files. It provides advisory static TSX checks, not a full security or accessibility audit. Dynamic props and external styles need human review.</p></div></>}
        <footer className="page-footer"><span>Thoughtfully built. Open by design.</span><div><span className="footer-status" />VirtuUI v0.1.0<span>·</span><span>MIT License</span></div></footer>
      </main>
    </div>
    <div className={`toast ${toast ? 'toast--visible' : ''}`} role="status" aria-live="polite">{toast && <><Check size={16} /><span>{toast}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={14} /></button></>}</div>
  </div>;
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-heading"><div><div className="eyebrow"><span />{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>;
}
