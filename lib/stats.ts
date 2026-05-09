// Outbreak statistics - update this file to change numbers displayed on website

function getTimeElapsed(dateString: string): string {
  const lastUpdate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - lastUpdate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

const lastUpdateTime = 'May 9, 2026, 10:53 AM';

export const outbreakStats = {
  cases: '5+',
  deaths: '3',
  countries: '7',
  mortality: '39%',
  lastUpdated: lastUpdateTime,
  lastUpdatedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  banner: {
    title: 'MV Hondius Cruise Ship Outbreak: 3 Deaths in 7 Countries',
    subtitle: `Updated ${getTimeElapsed('May 9, 2026, 10:53 AM')}`,
  },
};