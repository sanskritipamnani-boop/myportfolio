'use client';

import { useEffect, useRef } from 'react';
import styles from './KlenzaaCaseStudy.module.css';

interface MediaItemProps {
  filename: string;
  altText?: string;
  imageSrc?: string;
  fit?: boolean;
}

/**
 * MediaItem helper component.
 * Automatically handles PNG/JPG images and MP4 video walkthroughs.
 */
function MediaItem({ filename, altText, imageSrc, fit }: MediaItemProps) {
  const src = imageSrc || `/images/${filename}`;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src.endsWith('.mp4') || !videoRef.current) return;
    const video = videoRef.current;
    video.pause();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  if (src.endsWith('.mp4')) {
    const isFit = fit || filename.includes('property-panel');
    return (
      <div className={styles.videoFrame}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={isFit ? styles.fitVideo : styles.croppedVideo}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={altText || filename}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        margin: '0 auto',
        borderRadius: 10,
        border: '1px solid var(--line)',
      }}
    />
  );
}

export default function KlenzaaCaseStudy() {
  return (
    <div className={styles.klenzaaCaseStudy}>
      <div className={styles.page}>
        {/* HERO SECTION */}
        <div className={styles.hero}>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <p className={styles.label}>Role</p>
              <p className={styles.value}>Sole UI/UX Designer</p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.label}>Client</p>
              <p className={styles.value}>Clik Catalyst Agency &amp; Imparable Tech Pvt Ltd</p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.label}>Timeline</p>
              <p className={styles.value}>Oct to Dec 2025, 3 months</p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.label}>Scope</p>
              <p className={styles.value}>Host side product, end to end</p>
            </div>
          </div>
          <div className={styles.heroImage}>
            <MediaItem filename="klenzaa-animation.mp4" altText="Klenzaa animation preview" />
          </div>
        </div>

        {/* OVERVIEW SECTION */}
        <section id="overview" className={styles.section}>
          <span className={styles.kicker}>Overview</span>
          <h2>Klenzaa needed a working MVP before it could become a business.</h2>
          <p className={styles.body}>
            Klenzaa is a <strong>two sided platform connecting STR hosts with cleaning professionals</strong> who handle turnovers between guests. There was no existing product when I started. The client had a validated business idea, target personas, and a business level competitor analysis already in place. <strong>My job was to design the MVP that would carry all of it.</strong> They pointed me toward tools like Turno and asked me to study what worked, so Klenzaa could improve on it.
          </p>
        </section>

        {/* COMPETITIVE RESEARCH SECTION */}
        <section id="competitive-research" className={styles.section}>
          <span className={styles.kicker}>Competitive Research</span>
          <h2>
            The client&apos;s research told us who Klenzaa was competing with. It didn&apos;t tell us what we can improve on.
          </h2>
          <p className={styles.body}>
            So I ran my own teardown, not at the business or positioning level, but at the interaction level: was the dashboard clear with minimal steps, did the tool offer real automation for checklists and scheduling, or did navigation quietly turn admin heavy. I compared Turno, Breezeway, TIDY, Properly, ResortCleaning, Cleanster, and HostHive against those three questions.
          </p>
          <figure className={styles.figure}>
            <div style={{ width: '90%', margin: '0 auto' }}>
              <MediaItem
                filename="competitor-teardown.png"
                altText="UX teardown comparing Turno, Breezeway, TIDY, Properly and others"
              />
            </div>
            <figcaption className={styles.figcaption} style={{ textAlign: 'center' }}>
              My own pattern level teardown of seven competitor tools
            </figcaption>
          </figure>
        </section>

        {/* PAIN POINTS SECTION */}
        <section id="pain-points" className={styles.section}>
          <span className={styles.kicker}>Pain Points</span>
          <h2>Three problems came out of that teardown.</h2>
          <div className={styles.cardRow}>
            <div className={styles.card}>
              <span className={styles.cardNum}>01</span>
              <h3>Unclear task delegation</h3>
              <p>Hosts had no clean way to hand off a cleaning task to the right person with the right instructions.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardNum}>02</span>
              <h3>No real time visibility</h3>
              <p>Hosts couldn&apos;t see what stage a cleaning was at without checking manually.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardNum}>03</span>
              <h3>No standard for quality</h3>
              <p>Without a shared checklist system, cleaning quality varied from property to property.</p>
            </div>
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className={styles.section}>
          <span className={styles.kicker}>Solutions</span>
          <h2>How I solved those three core problems.</h2>
          <div className={styles.cardRow}>
            <div className={styles.card}>
              <span className={styles.cardNum}>01</span>
              <h3>Structured task handoff</h3>
              <p>
                Designed property-centric task assignment, which means a host assigns a cleaner and a checklist straight from a property panel or while setting it up, the host does not have to wander or get confused for assigning or handing off proper instructions.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardNum}>02</span>
              <h3>Live progress tracking</h3>
              <p>Built a single-source dashboard so hosts see real-time status updates without manual check-ins.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardNum}>03</span>
              <h3>Standardized checklist modules</h3>
              <p>Created modular, priority-tagged checklists to maintain consistent cleaning quality across properties.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', marginTop: '2rem' }}>
            <figure className={styles.walkthroughFigure}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--teal-deep)' }}>
                Sign Up Page Walkthrough
              </h3>
              <MediaItem
                filename="sign-up-page.mp4"
                altText="Sign Up Page Walkthrough"
              />
            </figure>

            <figure className={styles.walkthroughFigure}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--teal-deep)' }}>
                Dashboard Walkthrough
              </h3>
              <MediaItem
                filename="dashboard-final-walkthrough.mp4"
                altText="Dashboard Walkthrough"
              />
            </figure>

            <figure className={styles.walkthroughFigure}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--teal-deep)' }}>
                Checklists &amp; Modules Walkthrough
              </h3>
              <MediaItem
                filename="checklist-modules.mp4"
                altText="Checklists & Modules Walkthrough"
              />
            </figure>

            <figure className={styles.walkthroughFigure}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--teal-deep)' }}>
                Properties &amp; Property Details Panel Walkthrough
              </h3>
              <MediaItem
                filename="property-panel.mp4"
                altText="Properties & Property Details Panel Walkthrough"
              />
            </figure>
          </div>
        </section>

        {/* SCOPE & PRIORITIES SECTION */}
        <section id="scope-priorities" className={styles.section}>
          <span className={styles.kicker}>Scope &amp; Priorities</span>
          <p className={styles.body}>
            The MVP was shaped around fast property setup, understandable scheduling, property centric checklist assignment, structured checklist management, and a dashboard that acts as a single source of truth.
          </p>
        </section>

        {/* DASHBOARD ITERATIONS SECTION */}
        <section id="dashboard-iterations" className={styles.section}>
          <span className={styles.kicker}>Let&apos;s start with how the dashboard came to be...</span>
          <h2>Three versions, each one built to fix a specific problem in the version before it.</h2>

          <div className={styles.versionRowWrap}>
            <div className={styles.versionRow}>
              {/* VERSION 1 */}
              <div className={styles.versionBlock}>
                <span className={styles.vLabel}>Version 1</span>
                <h3>A calendar grid, color coded by property</h3>
                <p>Each property got its own color, plotted across a shared calendar view. It looked complete and communicated everything at a glance, in theory.</p>
                <p style={{ marginTop: '0.85rem', marginBottom: '1.25rem' }}>
                  <span className={styles.broke}>What broke:</span> past a handful of properties, hosts couldn&apos;t remember which color belonged to which property.
                </p>
                <figure className={styles.figure} style={{ width: '80%', margin: '1rem auto 0' }}>
                  <MediaItem
                    filename="dashboard-v1-color-coded_new.png"
                    altText="Version 1 dashboard color coded calendar grid"
                  />
                </figure>
              </div>

              {/* VERSION 2 */}
              <div className={styles.versionBlock}>
                <span className={styles.vLabel}>Version 2</span>
                <h3>Each property becomes its own row</h3>
                <p>Every property got a row, with its schedule laid out across the timeline. Reading the dashboard stopped requiring memorization.</p>
                <p style={{ marginTop: '0.85rem', marginBottom: '1.25rem' }}>
                  <span className={styles.broke}>What was still unresolved:</span> Color for task type too? What about same day conflicts? How can I help users see updates and proof directly from the dashboard and not wander around?
                </p>
                <figure className={styles.figure} style={{ width: '80%', margin: '1rem auto 0' }}>
                  <MediaItem
                    filename="dashboard_version2_self _crtique.png"
                    altText="Version 2 of the dashboard, annotated with open questions"
                  />
                </figure>
              </div>

              {/* VERSION 3 */}
              <div className={styles.versionBlock}>
                <span className={styles.vLabel}>Version 3</span>
                <h3>How the final version was improvised answering all design decisions</h3>

                <ul className={styles.v3BulletList}>
                  <li><strong>Color for task type too?</strong> Yes. Properties are unbounded, which is why their colors failed. Task types are a small, fixed set, so a fixed palette keeps working.</li>
                  <li><strong>Same day conflicts?</strong> Not a layout problem. The product simply doesn&apos;t allow two tasks on one property at the same time, so the conflict is prevented at the data level. Even if there is a time overlap, I have designed an overlap pattern directly into the calendar layout.</li>
                  <li><strong>Live progress tracking:</strong> Designed the dashboard directly so hosts can view ongoing cleaning work in real time and verify image proof, solving the challenge of live progress tracking.</li>
                </ul>

                <figure style={{ marginTop: '1.25rem', width: '64%', margin: '1.25rem auto 0' }} className={styles.figure}>
                  <MediaItem
                    filename="dashboard-final-walkthrough.mp4"
                    altText="Final Klenzaa dashboard, walked through end to end"
                  />
                </figure>

                <figure style={{ marginTop: '1.25rem' }} className={styles.figure}>
                  <div style={{ width: '65%', margin: '0 auto', overflow: 'hidden', borderRadius: '12px' }}>
                    <MediaItem
                      filename="product-card.png"
                      altText="Klenzaa product card design"
                    />
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* CHECKLISTS SECTION */}
        <section id="checklists" className={styles.section}>
          <span className={styles.kicker}>Checklists</span>
          <h2>The checklists have to work in a way that users can create separate checklists, edit them easily, and understand their modules so that when automated, the checklists are easily assigned to the properties.</h2>

          <div className={styles.v3AnswersWrap}>
            <div className={styles.v3Answers}>
              <div className={styles.decisionAnswer}>
                <p className={styles.q}>One checklist with a toggle, or two separate checklists?</p>
                <p className={styles.a}>
                  Two separate checklists. The host checklist covers personal management tasks, while the cleaner checklist (tagged For Cleaners) covers job-specific cleaning items. They are built and owned independently rather than filtered from a single shared list.
                </p>
              </div>
              <div className={styles.decisionAnswer}>
                <p className={styles.q}>Why organize checklist items into modules?</p>
                <p className={styles.a}>
                  Different properties require unique task combinations. Modular room blocks like Kitchen, Bedroom, and Bathroom, plus a General module, allow hosts to compose exact checklists per property rather than repeatedly editing one long master list.
                </p>
              </div>
              <div className={styles.decisionAnswer}>
                <p className={styles.q}>Why give individual items a priority tag?</p>
                <p className={styles.a}>
                  So the items that matter most don&apos;t get lost inside a longer module. A task like Broom hall can be marked High Priority inside the General module, so a cleaner moving quickly through the list still sees what can&apos;t be skipped.
                </p>
              </div>
            </div>
          </div>

          <figure className={styles.figure}>
            <MediaItem
              filename="checklist-modules.mp4"
              altText="Deep clean checklist for cleaners, organized into modules with priority tags and recommended modules panel"
            />
            <figcaption className={styles.figcaption}>
              A cleaner&apos;s checklist, built from modules, with priority tags and recommended modules to add
            </figcaption>
          </figure>

          <div className={styles.featureSplitWrap}>
            <div className={styles.featureSplit}>
              <div className={styles.featureBlock}>
                <h3>The harder problem underneath it</h3>
                <p>If a host edits a checklist on a single scheduled clean, how do we ensure future jobs across all properties aren&apos;t accidentally changed?</p>
                <p>
                  Instead of relying on warning labels, the interface prevents mistakes by default. Standard items are locked on scheduled cleans so hosts can only append one-off additions, keeping global automation intact.
                </p>
              </div>

              <figure className={styles.featureMedia}>
                <MediaItem
                  filename="checklist-additional-item.png"
                  altText="Adding a one off additional item to a scheduled clean checklist"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* PROPERTIES TAB SECTION */}
        <section id="properties-tab" className={styles.section}>
          <span className={styles.kicker}>Properties Tab</span>
          <h2>Properties &amp; Property Details Panel</h2>
          <p className={styles.body}>
            A property-centric management tab that gives hosts full visibility over their properties, active turnover schedules, assigned cleaners, and specific property details in a single clean panel.
          </p>
          <figure className={styles.figure}>
            <MediaItem
              filename="property-panel.mp4"
              altText="Klenzaa property details panel"
            />
          </figure>
        </section>

        {/* DESIGN SYSTEM SECTION */}
        <section id="design-system" className={styles.section}>
          <span className={styles.kicker}>Visual guide and components</span>
          <h2>The component library was kept small on purpose.</h2>
          <p className={styles.body}>
            Buttons, cards, status chips, side panels, nothing more. Building a bigger system ahead of real feedback is a bet on assumptions that haven&apos;t been tested yet. Klenzaa&apos;s component set stayed deliberately lean so it could evolve once real hosts and cleaners had used it, instead of locking in decisions before there was proof they were the right ones.
          </p>
          <figure className={styles.figure} style={{ marginTop: '1.5rem' }}>
            <MediaItem
              filename="design-system.png"
              altText="Klenzaa Design System visual guide"
            />
          </figure>
          <figure className={styles.figure} style={{ marginTop: '1.5rem' }}>
            <MediaItem
              filename="final_component.png"
              altText="Klenzaa Design System component library"
            />
          </figure>
        </section>

        {/* WHAT'S NEXT SECTION */}
        <section id="whats-next" className={styles.section}>
          <span className={styles.kicker}>What&apos;s Next</span>
          <h2>Property setup is manual today because automation needed a foundation first.</h2>
          <p className={styles.body}>
            The client&apos;s real long term goal is automated setup, pulling property data directly from Airbnb or Vrbo listings. Manual setup isn&apos;t a placeholder for that, it&apos;s the foundation it will sit on top of. Integration hooks for that pull already exist from this engagement, even though the automation itself sat outside the three month scope. If two more weeks opened up, this is where they would go, since it&apos;s the part furthest from where the product is actually headed.
          </p>
        </section>

        {/* SCOPE GRID SECTION */}
        <section id="scope" className={styles.section}>
          <span className={styles.kicker}>Scope</span>
          <h2>What I designed, and what stayed out of scope.</h2>
          <div className={styles.scopeGrid}>
            <div className={`${styles.scopeCard} ${styles.scopeCardIn}`}>
              <span className={styles.scopeLabel}>Designed end to end</span>
              <ul>
                <li>Property setup</li>
                <li>Scheduling</li>
                <li>Role based checklists</li>
                <li>Dashboard</li>
              </ul>
            </div>
            <div className={`${styles.scopeCard} ${styles.scopeCardOut}`}>
              <span className={styles.scopeLabel}>Out of scope</span>
              <ul>
                <li>Cleaner facing app</li>
                <li>Payment flows</li>
                <li>Formal user testing rounds</li>
              </ul>
            </div>
          </div>
        </section>

        {/* OUTCOME SECTION */}
        <section id="outcome" className={styles.section}>
          <span className={styles.kicker}>Outcome</span>
          <h2>Klenzaa&apos;s current product runs on this design.</h2>
          <p className={styles.body}>
            The live product uses this UI and these branding guidelines today. It&apos;s still evolving, and I don&apos;t have visibility into how real hosts or cleaners have responded since handoff. That&apos;s the honest state of it, not a guess dressed up as a metric.
          </p>
        </section>

        {/* REFLECTION SECTION */}
        <section id="reflection" className={styles.section} style={{ marginBottom: 0 }}>
          <span className={styles.kicker}>Reflection</span>
          <h2>What changed in how I design</h2>
          <blockquote className={styles.quoteBlock}>
            Before this project, most of my decisions were instinctive first, justified after. Klenzaa is where that flipped. Every element on a screen now needs a reason it exists, down to why a card is a certain size or why a color shows up here and not there.
          </blockquote>
        </section>
      </div>
    </div>
  );
}
