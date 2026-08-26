import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CohortConfig, WeekContent, WeekFrontmatter } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const WEEKS_DIR = path.join(CONTENT_DIR, 'weeks');

export function getCohortConfig(cohortId: string): CohortConfig | null {
  const filePath = path.join(CONTENT_DIR, `${cohortId}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as CohortConfig;
}

function weekFilePath(week: number): string {
  const padded = String(week).padStart(2, '0');
  return path.join(WEEKS_DIR, `week-${padded}.mdx`);
}

export function getWeekContent(week: number): WeekContent | null {
  const filePath = weekFilePath(week);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    frontmatter: data as WeekFrontmatter,
    body: content.trim(),
  };
}

export function getAllWeekNumbers(): number[] {
  if (!fs.existsSync(WEEKS_DIR)) return [];
  return fs
    .readdirSync(WEEKS_DIR)
    .filter((f) => /^week-\d{2}\.mdx$/.test(f))
    .map((f) => parseInt(f.slice(5, 7), 10))
    .sort((a, b) => a - b);
}

export function getAllWeeksContent(): WeekContent[] {
  return getAllWeekNumbers()
    .map((week) => getWeekContent(week))
    .filter((w): w is WeekContent => w !== null);
}
