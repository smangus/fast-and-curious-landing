import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getCohortConfig, getWeekContent } from '@/lib/content';
import { formatDate, displayOrTBD, venueLine } from '@/lib/dates';

interface PageProps {
  params: Promise<{ cohort: string; week: string }>;
}

function isTBD(value: string | undefined | null): boolean {
  return !value || value === 'TBD';
}

export default async function WeekPage({ params }: PageProps) {
  const { cohort: cohortId, week: weekParam } = await params;
  const weekMatch = /^week-(\d+)$/.exec(weekParam);
  const weekNumber = weekMatch ? parseInt(weekMatch[1], 10) : NaN;

  const cohort = getCohortConfig(cohortId);
  const weekContent = weekNumber ? getWeekContent(weekNumber) : null;

  if (!cohort || !weekContent) {
    notFound();
  }

  const { frontmatter, body } = weekContent;
  const { venue } = cohort;

  const hasMap = !isTBD(venue.mapUrl);
  const hasOutcomes = frontmatter.outcomes && frontmatter.outcomes.length > 0;
  const hasDeliverable = !!frontmatter.deliverable;
  const hasReferences = frontmatter.references && frontmatter.references.length > 0;
  const hasSlides = !!frontmatter.slidesUrl;

  return (
    <main>
      <header className="week-header">
        <div className="wrap">
          <span className="eyebrow">
            Week {frontmatter.week} · Phase {frontmatter.phase}
          </span>
          <h1>{frontmatter.title}</h1>
          <div className="meta-row">
            <span>
              <strong>{formatDate(frontmatter.sessionDate)}</strong>
            </span>
            <span>{frontmatter.format}</span>
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
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <h2>Before you arrive</h2>
          <div className="prework-card">
            {frontmatter.prework?.timeEstimate && (
              <span className="prework-time">{frontmatter.prework.timeEstimate}</span>
            )}
            <div className="prose">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          </div>
        </div>
      </section>

      {hasOutcomes && (
        <section className="block">
          <div className="wrap">
            <h2>What we&apos;ll cover</h2>
            <ul className="outcomes">
              {frontmatter.outcomes!.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="block">
        <div className="wrap">
          <h2>Materials</h2>
          <div className="materials-row">
            {frontmatter.colabUrl && (
              <a
                className="btn btn-primary"
                href={frontmatter.colabUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Colab
              </a>
            )}
            {frontmatter.workbookUrl && (
              <a className="btn btn-secondary" href={frontmatter.workbookUrl}>
                Workbook (PDF)
              </a>
            )}
            {hasSlides && (
              <a
                className="btn btn-secondary"
                href={frontmatter.slidesUrl!}
                target="_blank"
                rel="noopener noreferrer"
              >
                Slides
              </a>
            )}
          </div>
        </div>
      </section>

      {hasDeliverable && (
        <section className="block">
          <div className="wrap">
            <h2>Deliverable</h2>
            <div className="deliverable-card">
              <p>{frontmatter.deliverable!.description}</p>
              <span className="deliverable-due">
                Due: {displayOrTBD(frontmatter.deliverable!.dueDate)}
              </span>
            </div>
          </div>
        </section>
      )}

      {hasReferences && (
        <section className="block">
          <div className="wrap">
            <h2>Going further</h2>
            <ul className="references">
              {frontmatter.references!.map((ref) => (
                <li key={ref.url}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
