import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Dumbbell,
  Flame,
  Scale,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Panel } from "@/components/ui";

const features = [
  {
    icon: Dumbbell,
    number: "01",
    title: "Make every rep count.",
    text: "Log your sessions, track your training time, and turn showing up into a habit.",
  },
  {
    icon: Flame,
    number: "02",
    title: "Fuel your ambition.",
    text: "Keep your daily calorie intake in view with a clear, simple progress ring.",
  },
  {
    icon: Scale,
    number: "03",
    title: "See the bigger picture.",
    text: "Check in with your weight and watch your trend take shape, one day at a time.",
  },
];

export default function Home() {
  return (
    <div className="landing">
      <header className="landing-header">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#features">The experience</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <Link href="/dashboard" className="button button-outline">
          Open dashboard <ArrowUpRight size={16} />
        </Link>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">
              <span /> BUILT FOR THE WORK YOU PUT IN
            </span>
            <h1>
              Build your
              <br />
              better<span className="accent">.</span>
              <br />
              <span className="outline-word">Every day.</span>
            </h1>
            <p>
              One space for your workouts, your fuel, and your progress. Less
              noise. More momentum.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="button button-primary">
                Explore your dashboard <ArrowRight size={18} />
              </Link>
              <span>No sign-up. Just show up.</span>
            </div>
            <div className="hero-proof">
              <span>
                <Check size={14} />
                Free starter
              </span>
              <span>
                <Check size={14} />
                Your browser, your data
              </span>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Preview with illustrative sample fitness statistics"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="visual-cross cross-one">+</div>
            <div className="visual-cross cross-two">+</div>
            <div className="hero-orb">
              <div className="orb-inner">
                <Activity size={62} strokeWidth={1.3} />
                <span>FIND YOUR</span>
                <strong>STRONG.</strong>
                <div className="orb-caption">CONSISTENCY OVER PERFECTION</div>
              </div>
            </div>
            <Panel className="floating-card floating-workout">
              <div className="floating-icon">
                <Dumbbell size={20} />
              </div>
              <div>
                <span>THIS WEEK · SAMPLE</span>
                <strong>4 workouts</strong>
              </div>
              <span className="mini-wave">▂▅▃▇▅</span>
            </Panel>
            <Panel className="floating-card floating-weight">
              <div>
                <span>PROGRESS · SAMPLE</span>
                <strong>
                  −1.4<span> kg</span>
                </strong>
                <p>Small steps, real momentum.</p>
              </div>
              <div className="mini-trend">
                <ArrowDownRight size={38} aria-hidden="true" />
              </div>
            </Panel>
            <span className="visual-label">
              YOUR ONLY COMPETITION IS YESTERDAY.
            </span>
          </div>
        </section>
        <div className="principles-strip">
          <span>TRAIN WITH INTENTION</span>
          <i />
          <span>FUEL WITH PURPOSE</span>
          <i />
          <span>PROGRESS AT YOUR PACE</span>
          <i />
          <span>SHOW UP FOR YOURSELF</span>
        </div>
        <section className="features-section" id="features">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EVERYTHING THAT MOVES YOU</span>
              <h2>
                Stay focused.
                <br />
                Get stronger.
              </h2>
            </div>
            <p>
              You bring the effort. We bring a little clarity.
              <br />A simpler way to see how far you’ve come.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, ...feature }) => (
              <Panel className="feature-card" key={feature.number}>
                <div className="feature-top">
                  <span className="feature-icon">
                    <Icon size={24} />
                  </span>
                  <span>{feature.number}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-line" />
              </Panel>
            ))}
          </div>
        </section>
        <section className="start-section" id="how-it-works">
          <div>
            <span className="eyebrow">A FRESH START, WITHOUT THE FRICTION</span>
            <h2>
              Your next session
              <br />
              starts here<span className="accent">.</span>
            </h2>
            <p>
              Explore the sample dashboard. Log a workout. Make it yours.
              <br />
              Entries save locally in your browser, ready for your next visit.
            </p>
            <Link href="/dashboard" className="button button-primary">
              Let’s get moving <ArrowRight size={18} />
            </Link>
          </div>
          <div className="steps">
            <div>
              <span>01</span>
              <p>
                Open your space<strong>No account needed.</strong>
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                Put in the work
                <strong>Log workouts, calories, and weight.</strong>
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                Keep your momentum
                <strong>See your progress build over time.</strong>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <p>Built for your next personal best.</p>
        <span>Starter project · Browser-local storage</span>
      </footer>
    </div>
  );
}
