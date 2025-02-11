import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";
import { Logger } from "@/server/utils/logger";
import { createGlobal } from "@/server/utils/globalStorage";

const logger = Logger.for("Scheduler");

/** {@see https://github.com/kibertoad/toad-scheduler} */
export const scheduler = createGlobal("scheduler", new ToadScheduler());

// Interface for job metadata
interface JobMeta {
  id: string;
  interval: number; // Interval in seconds
  handler: (id: string) => Promise<void>; // Async function for job logic
}

/**
 * Create and start a scheduled job.
 * @param jobMeta - Metadata for the job.
 */
export function createJob(jobMeta: JobMeta): void {
  const { id, interval, handler } = jobMeta;

  const task = new Task(id, async () => {
    logger.debug(
      `[Create Job] Running job "${id}" at ${new Date().toISOString()}`,
    );
    try {
      await handler(id);
    } catch (error) {
      logger.error(`[Create Job] Error in job "${id}":`, error);
    }
  });

  const job = new SimpleIntervalJob(
    { seconds: interval, runImmediately: true },
    task,
    { id, preventOverrun: true },
  );
  scheduler.addSimpleIntervalJob(job);

  logger.debug(
    `[Create Job] Scheduled job "${id}" with interval: ${interval} seconds`,
  );
}

/**
 * Stop and delete a scheduled job.
 * @param jobId - Unique identifier for the job to stop.
 */
export function stopJob(jobId: string): void {
  const hasJob = scheduler.existsById(jobId);

  if (hasJob) {
    scheduler.stopById(jobId);
    scheduler.removeById(jobId);

    logger.debug(`[Stop Job] Stopped and removed job "${jobId}"`);
  } else {
    logger.warn(`[Stop Job] No job found with ID "${jobId}"`);
  }
}

/**
 * Stop all active jobs.
 */
export function stopAllJobs(): void {
  scheduler.stop();
  listJobs().forEach((jobId) => {
    scheduler.removeById(jobId);
  });

  logger.debug("[Stop All Jobs] All jobs stopped.");
}

/**
 * Get a list of all active jobs.
 * @returns An array of active job IDs.
 */
export function listJobs(): string[] {
  const jobs = scheduler.getAllJobs();
  return jobs.map((job) => job.id) as string[];
}
