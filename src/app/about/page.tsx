import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Info — Sonnen Café London" };

const SEATING = [
  { emoji: "🪑", name: "Pavement", note: "Tables out front" },
  { emoji: "🏡", name: "Terrace", note: "A raised or marked-off area" },
  { emoji: "🏛️", name: "Courtyard", note: "Tucked between buildings" },
  { emoji: "🌳", name: "Garden", note: "A planted outdoor space" },
];

const SUN_STEPS = [
  { emoji: "🌞", title: "Where the sun is", note: "Its exact direction and height, any time of day." },
  { emoji: "🏙️", title: "What's in the way", note: "Which way the seats face and how much the buildings around them block." },
  { emoji: "🌦️", title: "The forecast", note: "Hour-by-hour cloud and rain, so a grey sky isn't called sunny." },
];

export default function Info() {
  return (
    <>
      <SiteHeader />
      <main className="container app-main about-page">
        <p className="eyebrow">Info</p>
        <h2>Outdoor seating, in the sun</h2>
        <p className="about-lead">
          Sonnen Café London finds London cafés that have outdoor seating, then checks which of them are
          catching the sun &mdash; right now, later today or tomorrow, weather included.
        </p>

        <div className="info-pillars">
          <div className="info-pillar">
            <span className="info-emoji" aria-hidden="true">🪑</span>
            <h3>Finding the seats</h3>
            <p>We only list cafés with outdoor seating. That alone saves a lot of wandering.</p>
          </div>
          <div className="info-pillar">
            <span className="info-emoji" aria-hidden="true">☀️</span>
            <h3>Checking the sun</h3>
            <p>For each one we work out when its seats are actually sunny, and when they&apos;re not.</p>
          </div>
        </div>

        <aside className="info-wip">
          <span className="info-emoji" aria-hidden="true">🌱</span>
          <div>
            <h3>A work in progress</h3>
            <p>
              We&apos;re starting with cafés in central London and adding more parts of the city as we check
              more cafés. The sun times are good estimates, not promises &mdash; trees, awnings and passing
              clouds can surprise us.
            </p>
          </div>
        </aside>

        <h3 className="info-heading">Four kinds of seating</h3>
        <div className="info-seating">
          {SEATING.map((s) => (
            <div key={s.name} className="info-seating-tile">
              <span className="info-emoji" aria-hidden="true">{s.emoji}</span>
              <strong>{s.name}</strong>
              <span>{s.note}</span>
            </div>
          ))}
        </div>

        <h3 className="info-heading">How we work out the sun</h3>
        <div className="info-steps">
          {SUN_STEPS.map((step) => (
            <div key={step.title} className="info-step">
              <span className="info-emoji" aria-hidden="true">{step.emoji}</span>
              <div>
                <strong>{step.title}</strong>
                <span>{step.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="info-result">
          <span aria-hidden="true">⏱️</span> Put together, that gives every café a sun timeline for today and tomorrow.
        </p>

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
