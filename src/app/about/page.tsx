import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Info — Sonnen Café London" };

const SEATING = [
  { name: "Pavement", note: "Tables out front" },
  { name: "Terrace", note: "Raised or marked off" },
  { name: "Courtyard", note: "Between buildings" },
  { name: "Garden", note: "Planted outdoor space" },
];

const SUN_STEPS = [
  { title: "Where the sun is", note: "Its exact direction and height, any time of day." },
  { title: "What's in the way", note: "Which way the seats face and how much the buildings around them block." },
  { title: "The forecast", note: "Hour-by-hour cloud and rain, so a grey sky isn't called sunny." },
];

export default function Info() {
  return (
    <>
      <SiteHeader />
      <main className="container app-main about-page">
        <p className="eyebrow">Info</p>
        <h2>Chasing the sun, one coffee at a time</h2>
        <p className="about-lead">
          Sonnen Café London helps you find a café with outdoor seating that&apos;s actually in the sun. We look for
          cafés with tables outside and then check which of them the sun reaches, hour by hour, right now, later
          today or tomorrow, with the weather taken into account too.
        </p>

        <div className="info-pillars">
          <div className="info-pillar">
            <span className="info-emoji" aria-hidden="true">🪑</span>
            <h3>Finding outdoor seating</h3>
            <p>We find cafés with outdoor seating, so you don&apos;t have to wander around looking for a spot where you can soak up the sun.</p>
          </div>
          <div className="info-pillar">
            <span className="info-emoji" aria-hidden="true">☀️</span>
            <h3>Checking the sun</h3>
            <p>For every café, we work out when the sun actually reaches its tables, so you know when to go where.</p>
          </div>
        </div>

        <aside className="info-wip">
          <h3>A work in progress</h3>
          <p>
            We&apos;re starting with a small group of cafés in central London, checking each one carefully before we
            add more parts of the city. These are estimates, not guarantees &mdash; real life has trees, awnings and
            passing clouds we can&apos;t see.
          </p>
        </aside>

        <h3 className="info-heading">Four kinds of seating</h3>
        <div className="info-seating">
          {SEATING.map((s) => (
            <div key={s.name} className="info-seating-tile">
              <strong>{s.name}</strong>
              <span>{s.note}</span>
            </div>
          ))}
        </div>

        <h3 className="info-heading">How we work out the sun</h3>
        <div className="info-steps">
          {SUN_STEPS.map((step, index) => (
            <div key={step.title} className="info-step">
              <span className="info-step-number" aria-hidden="true">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <span>{step.note}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="info-sources">
          Café details, photos and opening hours come from Google. Building outlines are &copy;{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            OpenStreetMap contributors
          </a>
          . Building and tree heights come from Environment Agency LIDAR surveys, contains public sector information
          licensed under the{" "}
          <a
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Government Licence v3.0
          </a>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
