import {
  ArrowLeft,
  ArrowRight,
  Code2,
  GraduationCap,
  PackageOpen,
  Pill,
  Smartphone,
} from "lucide-react";
import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

const products = [
  {
    slug: "mobile-store-management-system",
    name: "Mobile Store Management System",
    category: "Retail operations",
    description: "A dedicated management system for mobile phone retail businesses.",
    overview:
      "A focused operational workspace for managing the day-to-day activity of a mobile phone store from one system.",
    audience: "Mobile phone retailers, store operators, managers, and multi-branch businesses.",
    icon: Smartphone,
    accent: "gold",
    capabilities: [
      ["Inventory", "Organize devices, accessories, models, variants, and current stock."],
      ["Sales", "Keep sales activity, invoices, and customer transactions connected."],
      ["Purchasing", "Track suppliers, incoming products, and purchasing activity."],
      ["Store operations", "Bring essential retail workflows into one management view."],
    ],
  },
  {
    slug: "pharmacy-management-system",
    name: "Pharmacy Management System",
    category: "Pharmacy operations",
    description: "An operational management system built for pharmacy businesses.",
    overview:
      "A central system for coordinating medicine inventory, purchasing, sales, and pharmacy operations.",
    audience: "Independent pharmacies, pharmacy teams, operators, and business managers.",
    icon: Pill,
    accent: "green",
    capabilities: [
      ["Medicine inventory", "Maintain an organized view of medicines and available stock."],
      ["Batch and expiry", "Support batch-aware records and expiry-sensitive inventory workflows."],
      ["Sales", "Connect pharmacy sales activity with inventory movement."],
      ["Suppliers", "Keep supplier and purchasing information available to operations teams."],
    ],
  },
  {
    slug: "school-management-system",
    name: "School Management System",
    category: "Education operations",
    description: "A centralized management system designed for schools.",
    overview:
      "A shared operational system for managing school records, administration, and recurring academic workflows.",
    audience: "Schools, administrators, teachers, operations teams, and academic leadership.",
    icon: GraduationCap,
    accent: "blue",
    capabilities: [
      ["Student records", "Maintain structured student and enrollment information."],
      ["Attendance", "Support recurring attendance workflows for students and classes."],
      ["Fees", "Keep fee records and related administrative activity organized."],
      ["Academic operations", "Coordinate essential school administration from one system."],
    ],
  },
];

const quickTools = [];
const pricingPlans = [
  { name: "Economy", price: "800 BDT", originalPrice: "1,000 BDT" },
  { name: "Premium", price: "1,200 BDT", originalPrice: "1,500 BDT" },
  { name: "Enterprise", price: "2,000 BDT", originalPrice: "2,500 BDT" },
];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

function SiteLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="https://robinmollah.com/" aria-label="Robin Mollah home">
          <span className="brand-mark">RM</span>
          <span className="brand-name">Robin Mollah</span>
        </a>
        <nav aria-label="Primary navigation">
          <Link to="/">Products</Link>
          <Link to="/#tools">Quick Tools</Link>
          <a className="profile-link" href="https://robinmollah.com/profile/">
            Professional Profile
          </a>
          <a
            className="icon-link"
            href="https://github.com/robinmollah"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <Code2 aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <span>Products &amp; Tools</span>
        <span>Robin Mollah</span>
      </footer>
    </div>
  );
}

function CatalogPage() {
  useEffect(() => {
    document.title = "Products & Tools | Robin Mollah";
  }, []);

  return (
    <>
      <section id="products" className="product-catalog" aria-labelledby="page-title">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">Business software</p>
            <h1 id="page-title">SaaS Product Catalog</h1>
          </div>
          <p className="catalog-intro">
            Management systems designed around the day-to-day operations of focused industries.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <article className={`product-card product-${product.accent}`} key={product.name}>
                <div className="product-card-top">
                  <span className="product-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="product-icon" aria-hidden="true">
                    <Icon />
                  </span>
                </div>
                <div className="product-copy">
                  <p>{product.category}</p>
                  <h2>
                    <Link to={`/products/${product.slug}`}>
                      {product.name}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </h2>
                  <span>{product.description}</span>
                </div>
                <div className="product-type">
                  <span>SaaS</span>
                  <span>Management system</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="tools" className="quick-tools" aria-labelledby="tools-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Small utilities</p>
            <h2 id="tools-title">Quick Tools</h2>
          </div>
          <span>{quickTools.length}</span>
        </div>

        {quickTools.length > 0 ? (
          <ul className="tool-list">
            {quickTools.map((tool) => (
              <li key={tool.name}>
                <a href={tool.href}>{tool.name}</a>
                <span>{tool.category}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="tool-empty">
            <PackageOpen aria-hidden="true" />
            <span>Quick tools will be listed here.</span>
          </div>
        )}
      </section>
    </>
  );
}

function ProductDetailsPage() {
  const { productSlug } = useParams();
  const product = products.find((item) => item.slug === productSlug);

  useEffect(() => {
    if (product) document.title = `${product.name} | Robin Mollah`;
  }, [product]);

  if (!product) return <Navigate to="/" replace />;

  const Icon = product.icon;
  return (
    <article className={`product-details product-${product.accent}`}>
      <div className="detail-back-row">
        <Link className="back-link" to="/">
          <ArrowLeft aria-hidden="true" />
          Product catalog
        </Link>
        <span>SaaS / Management system</span>
      </div>

      <header className="detail-hero">
        <div className="detail-heading">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.overview}</p>
        </div>
        <div className="detail-visual" aria-hidden="true">
          <span><Icon /></span>
          <i />
          <i />
          <i />
        </div>
      </header>

      <div className="detail-layout">
        <section className="capability-section" aria-labelledby="capabilities-title">
          <p className="eyebrow">System scope</p>
          <h2 id="capabilities-title">Core operational areas</h2>
          <div className="capability-list">
            {product.capabilities.map(([name, description], index) => (
              <div className="capability-row" key={name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="detail-aside">
          <p className="eyebrow">Designed for</p>
          <p>{product.audience}</p>
          <a
            href={`mailto:contact@robinmollah.com?subject=${encodeURIComponent(product.name)}`}
          >
            Discuss this product
            <ArrowRight aria-hidden="true" />
          </a>
        </aside>
      </div>

      <section className="pricing-section" aria-labelledby="pricing-title">
        <div className="pricing-heading">
          <div>
            <p className="eyebrow">Plans</p>
            <h2 id="pricing-title">Pricing</h2>
          </div>
          <span>BDT</span>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <article className={index === 1 ? "pricing-plan pricing-plan-featured" : "pricing-plan"} key={plan.name}>
              <span className="pricing-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{plan.name}</h3>
              <p className="current-price">{plan.price}</p>
              <p className="original-price">
                Discounted from <s>{plan.originalPrice}</s>
              </p>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<CatalogPage />} />
          <Route path="products/:productSlug" element={<ProductDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
