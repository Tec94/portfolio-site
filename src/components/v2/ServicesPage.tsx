import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  Braces,
  Gauge,
  Layers3,
  PenTool,
  ScanSearch,
} from 'lucide-react';

const services = [
  {
    id: 'web-development',
    title: 'Web development',
    brief: 'Production interfaces with a strong technical spine.',
    outcome: 'A maintainable application that feels fast and works across real devices.',
    deliverables: ['React or Next.js application', 'API and auth integration', 'Testing and deployment handoff'],
    principles: ['Accessible by default', 'Observable failure states', 'Measured performance'],
    icon: Braces,
  },
  {
    id: 'product-engineering',
    title: 'Product engineering',
    brief: 'Turn an ambiguous product idea into a usable first release.',
    outcome: 'A scoped MVP with the right architecture for what comes after launch.',
    deliverables: ['Technical discovery', 'End-to-end feature implementation', 'Data model and delivery plan'],
    principles: ['Smallest valuable scope', 'Decisions made visible', 'No demo-only shortcuts'],
    icon: Layers3,
  },
  {
    id: 'ui-ux-design',
    title: 'UI / UX design',
    brief: 'Flows and interfaces built around comprehension.',
    outcome: 'A coherent interaction model that users can understand without instruction.',
    deliverables: ['User flows and wireframes', 'Interactive prototype', 'Implementation-ready design system'],
    principles: ['Content before chrome', 'Keyboard parity', 'Reusable patterns'],
    icon: PenTool,
  },
  {
    id: 'performance-seo',
    title: 'Performance & SEO',
    brief: 'Find the friction, fix the system, prove the result.',
    outcome: 'Faster experiences and clearer search signals without visual regressions.',
    deliverables: ['Core Web Vitals audit', 'Bundle and delivery remediation', 'Before-and-after measurement'],
    principles: ['Field data first', 'Progressive loading', 'Sustainable fixes'],
    icon: Gauge,
  },
  {
    id: 'technical-consulting',
    title: 'Technical consulting',
    brief: 'A focused second opinion before an expensive decision.',
    outcome: 'A practical direction your team can execute with risks and tradeoffs understood.',
    deliverables: ['Architecture or code review', 'Prioritized recommendations', 'Implementation workshop'],
    principles: ['Evidence over fashion', 'Clear ownership', 'Actionable handoff'],
    icon: ScanSearch,
  },
] as const;

export default function ServicesPage() {
  const [activeId, setActiveId] = useState<(typeof services)[number]['id']>(services[0].id);
  const active = services.find((service) => service.id === activeId) ?? services[0];

  return (
    <div className="v2-page v2-services-page">
      <header className="v2-page-header">
        <div>
          <p className="v2-eyebrow">Services / focused engagements</p>
          <h1>From uncertain brief to useful product.</h1>
          <p className="v2-lede">
            I work with small teams that need design judgment and implementation depth in the
            same room.
          </p>
        </div>
        <NavLink className="v2-button v2-button-primary" to={`/contact?projectType=${active.id}`}>
          Discuss a project <ArrowRight size={17} aria-hidden="true" />
        </NavLink>
      </header>

      <div className="v2-services-layout">
        <section className="v2-service-index" aria-label="Capabilities">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = service.id === active.id;
            return (
              <article key={service.id} className={isActive ? 'is-active' : undefined}>
                <button
                  onClick={() => setActiveId(service.id)}
                  aria-expanded={isActive}
                  aria-controls={`service-detail-${service.id}`}
                >
                  <span>{(index + 1).toString().padStart(2, '0')}</span>
                  <Icon size={19} aria-hidden="true" />
                  <span>
                    <strong>{service.title}</strong>
                    <small>{service.brief}</small>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <div
                  id={`service-detail-${service.id}`}
                  className="v2-service-mobile-detail"
                  hidden={!isActive}
                >
                  <p>{service.outcome}</p>
                  <ul>
                    {service.deliverables.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <NavLink to={`/contact?projectType=${service.id}`}>
                    Start with {service.title.toLowerCase()} <ArrowRight size={15} />
                  </NavLink>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="v2-service-blueprint" aria-live="polite">
          <div className="v2-blueprint-grid" aria-hidden="true" />
          <div className="v2-blueprint-heading">
            <span>Active capability</span>
            <strong>{services.findIndex((item) => item.id === active.id) + 1}/05</strong>
          </div>
          <active.icon className="v2-blueprint-icon" aria-hidden="true" />
          <h2>{active.title}</h2>
          <p>{active.outcome}</p>
          <div className="v2-blueprint-flow" aria-label="Engagement flow">
            <span>Frame</span><i /><span>Build</span><i /><span>Prove</span>
          </div>
          <div className="v2-blueprint-columns">
            <div>
              <h3>Deliverables</h3>
              <ul>{active.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Working principles</h3>
              <ul>{active.principles.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <NavLink className="v2-button v2-button-primary" to={`/contact?projectType=${active.id}`}>
            Start with this capability <ArrowRight size={17} />
          </NavLink>
        </aside>
      </div>
    </div>
  );
}
