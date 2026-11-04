function Sun({ className }: { className: string }) {
  return (
    <svg className={`hero-sun ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="50" cy="50" r="19" />
        <path d="M50 6v14M50 80v14M6 50h14M80 50h14" />
        <path d="M18.9 18.9l9.9 9.9M71.2 71.2l9.9 9.9M81.1 18.9l-9.9 9.9M28.8 71.2l-9.9 9.9" />
      </g>
    </svg>
  );
}

// Decorative black outline suns scattered around the home page heading: two on the left and three on the right,
// in different sizes and tilts so the two sides don't mirror each other.
export function HeroSuns() {
  return (
    <div className="hero-suns" aria-hidden="true">
      <Sun className="hero-sun--l1" />
      <Sun className="hero-sun--l2" />
      <Sun className="hero-sun--r1" />
      <Sun className="hero-sun--r2" />
      <Sun className="hero-sun--r3" />
    </div>
  );
}
