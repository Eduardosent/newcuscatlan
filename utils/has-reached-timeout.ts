export const hasReachedTimeout = (
  startTime: number, 
  duration: number
): { reached: boolean; left: string | null } => {
  const now = Math.floor(Date.now() / 1000);
  const secondsInDay = 86400;
  const timeToReach = startTime + (duration * secondsInDay);
  
  const diff = timeToReach - now;

  let left: string | null = null;
  
  if (diff > 0) {
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    left = `${hours}h ${minutes}m ${seconds}s`;
  }

  return {
    reached: now >= timeToReach,
    left
  };
};