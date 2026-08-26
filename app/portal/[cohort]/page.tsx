import { notFound } from 'next/navigation';
import { getCohortConfig, getAllWeeksContent } from '@/lib/content';
import { formatDate, formatTime, venueLine, getWeekState, getCohortStatus } from '@/lib/dates';

interface PageProps {
  params: Promise<{ cohort: string }>;
}

function isTBD(value: string | undefined | null): boolean {
  return !value || value === 'TBD';
}

function FooterLink({ label, url }: { label: string; url: string }) {
  if (isTBD(url)) {
    return <span className="footer-link-tbd">{label} (to be announced)</span>;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

export default async function CohortHubPage({ params }: PageProps) {
  const { cohort: cohortId } = await params;
  const cohort = getCohortConfig(cohortId);
  const weeks = getAllWeeksContent();

  if (!cohort) {
    notFound();
  }

  const { venue, links } = cohort;
  const hasMap = !isTBD(venue.mapUrl);
  const status = getCohortStatus(weeks);
  const bannerWeek = status.phase === 'post-end' ? status.currentWeek : status.nextWeek;

  return (
    <main>
      <section className="banner">
        <div className="wrap">
          {status.phase === 'post-end' ? (
            <>
              <span className="eyebrow">Cohort complete</span>
              <h1>{cohort.name}</h1>
              <p className="banner-line">
                All eight weeks are wrapped. Materials for every module stay available below.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow">
                {status.phase === 'during' ? `Week ${status.currentWeek?.frontmatter.week} · ` : ''}
                Next session
              </span>
              <h1>{bannerWeek ? bannerWeek.frontmatter.title : cohort.name}</h1>
              <div className="meta-row">
                <span>
                  <strong>{formatDate(bannerWeek?.frontmatter.sessionDate)}</strong>
                </span>
                <span>
                  {formatTime(cohort.sessionTime.start)}
                  {' – '}
                  {formatTime(cohort.sessionTime.end)}
                </span>
                <span>
                  {venueLine(venue)}
                  {hasMap && (
                    <>
                      {' '}
                      ·{' '}
                      <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer">
                        map
                      </a>
                    </>
                  )}
                </span>
              </div>
              {bannerWeek && (
                <p className="banner-line">
                  {bannerWeek.frontmatter.prework?.timeEstimate ? (
                    <>
                      Before you arrive: {bannerWeek.frontmatter.prework.timeEstimate} of pre-work — see{' '}
                      <a href={`/portal/${cohort.id}/week-${bannerWeek.frontmatter.week}`}>
                        Week {bannerWeek.frontmatter.week}
                      </a>{' '}
                      for details.
                    </>
                  ) : (
                    <>
                      Pre-work details are on the{' '}
                      <a href={`/portal/${cohort.id}/week-${bannerWeek.frontmatter.week}`}>
                        Week {bannerWeek.frontmatter.week}
                      </a>{' '}
                      page.
                    </>
                  )}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <section className="block">
        <div className="wrap wrap-wide">
          <h2>All weeks</h2>
          <div className="module-grid">
            {weeks.map((w) => {
              const state = getWeekState(w.frontmatter.sessionDate);
              return (
                <a
                  key={w.frontmatter.week}
                  href={`/portal/${cohort.id}/week-${w.frontmatter.week}`}
                  className={`module-card state-${state}`}
                >
                  <span className="module-week">Week {w.frontmatter.week}</span>
                  <h3>{w.frontmatter.title}</h3>
                  <span className="module-format">{w.frontmatter.format}</span>
                  <span className="module-date">{formatDate(w.frontmatter.sessionDate)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="portal-footer">
        <div className="wrap wrap-wide footer-links">
          <FooterLink label="Slack" url={links.slack} />
          <FooterLink label="GitHub" url={links.github} />
          <FooterLink label="Office hours" url={links.officeHours} />
        </div>
      </footer>
    </main>
  );
}
