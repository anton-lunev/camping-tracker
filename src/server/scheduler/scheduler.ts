import schedule, { Job } from "node-schedule";

/**
 * Convert seconds into a cron expression for recurring intervals.
 * @param seconds - Interval in seconds.
 * @returns Cron syntax string.
 */
export function secondsToCron(seconds: number): string {
  if (seconds <= 0) {
    throw new Error("Seconds must be greater than 0.");
  }

  // For intervals <= 60 seconds
  if (seconds <= 60) {
    return `*/${seconds} * * * * *`; // Every "seconds" seconds
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // For intervals <= 3600 seconds (1 hour)
  if (minutes < 60) {
    return remainingSeconds === 0
      ? `*/${minutes} * * * *` // Every "minutes"
      : `${remainingSeconds} */${minutes} * * * *`; // Every "minutes" at specific seconds
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  // For intervals > 3600 seconds (1 hour)
  return `${remainingSeconds} ${remainingMinutes === 0 ? "*" : `*/${remainingMinutes}`} */${hours} * * *`;
}

// Interface for job metadata
interface JobMeta {
  id: string;
  rule: string | Date; // Cron-like schedule or a specific date
  handler: (id: string) => Promise<void>; // Async function for job logic
}

// Map to store active jobs
const activeJobs: Map<string, Job> = new Map();

/**
 * Create and start a scheduled job.
 * @param jobMeta - Metadata for the job.
 */
export function createJob(jobMeta: JobMeta): void {
  const { id, rule, handler } = jobMeta;

  if (activeJobs.has(id)) {
    console.log(`Job with ID "${id}" already exists.`);
    return;
  }

  const job = schedule.scheduleJob(rule, async () => {
    console.log(`Running job "${id}" at ${new Date().toISOString()}`);
    try {
      await handler(id);
    } catch (error) {
      console.error(`Error in job "${id}":`, error);
    }
  });

  activeJobs.set(id, job);
  console.log(`Scheduled job "${id}" with rule: ${rule}`);
}

/**
 * Stop and delete a scheduled job.
 * @param jobId - Unique identifier for the job to stop.
 */
export function stopJob(jobId: string): void {
  const job = activeJobs.get(jobId);

  if (job) {
    job.cancel();
    activeJobs.delete(jobId);
    console.log(`Stopped and removed job "${jobId}"`);
  } else {
    console.log(`No job found with ID "${jobId}"`);
  }
}

/**
 * Stop all active jobs.
 */
export function stopAllJobs(): void {
  activeJobs.forEach((job, jobId) => {
    job.cancel();
    console.log(`Stopped job "${jobId}"`);
  });

  activeJobs.clear();
  console.log("All jobs stopped.");
}

/**
 * Get a list of all active jobs.
 * @returns An array of active job IDs.
 */
export function listJobs(): string[] {
  return Array.from(activeJobs.keys());
}
