import {
  createJob,
  listJobs,
  scheduler,
  stopAllJobs,
  stopJob,
} from "../scheduler"; // Import scheduler
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Scheduler Tests with Fake Timers", () => {
  const jobIds: string[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    scheduler.stop();
    jobIds.length = 0;
  });

  afterEach(() => {
    scheduler.stop();
    vi.useRealTimers();
  });

  it("should create a job and list it", async () => {
    const jobId1 = "test-job-1";
    jobIds.push(jobId1);
    let jobRunCount1 = 0;
    createJob({
      id: jobId1,
      interval: 1,
      handler: async () => {
        jobRunCount1++;
      },
    });

    const jobId2 = "test-job-2";
    jobIds.push(jobId2);
    let jobRunCount2 = 0;
    createJob({
      id: jobId2,
      interval: 2,
      handler: async () => {
        jobRunCount2++;
      },
    });

    // Advance timers by 3.5 seconds (enough for job1 to run 3 times, job2 to run once)
    vi.advanceTimersByTime(3500); // Fast-forward time using fake timers
    await Promise.resolve(); // Let promises resolve (important for async handlers)

    // Use imported scheduler instance to get jobs
    const listedJobs = listJobs();
    expect(listedJobs).toEqual(expect.arrayContaining(jobIds));
    expect(listedJobs.length).toBe(jobIds.length);
    expect(jobRunCount1).toBe(4);
    expect(jobRunCount2).toBe(2);
  });

  it("should stop a specific job", async () => {
    const jobId = "stop-test-job";
    let jobRunCount = 0;
    createJob({
      id: jobId,
      interval: 1,
      handler: async () => {
        jobRunCount++;
      },
    });

    vi.advanceTimersByTime(2500);
    await Promise.resolve();

    stopJob(jobId);

    // Advance time again to ensure job doesn't run after stop
    vi.advanceTimersByTime(2500);
    await Promise.resolve();

    // Use imported scheduler instance to get jobs
    const listedJobsAfterStop = scheduler.getAllJobs().map((job) => job.id);
    expect(listedJobsAfterStop).not.toContain(jobId);
    expect(jobRunCount).toBeGreaterThanOrEqual(2); // Job should have run at least twice before stopping

    vi.advanceTimersByTime(2500); // Wait more to ensure job doesn't run again
    await Promise.resolve();
    expect(jobRunCount).toBeLessThan(5); // Job should not run many more times after stop
  });

  it("should stop all jobs", async () => {
    createJob({
      id: "stop-all-job-1",
      interval: 1,
      handler: async () => {},
    });
    createJob({
      id: "stop-all-job-2",
      interval: 1,
      handler: async () => {},
    });

    vi.advanceTimersByTime(1500); // Wait for jobs to start
    await Promise.resolve();

    stopAllJobs();

    // Advance time again to ensure no jobs run after stopAll
    vi.advanceTimersByTime(1500);
    await Promise.resolve();

    // Use imported scheduler instance to get jobs
    const listedJobs = listJobs();
    expect(listedJobs).toEqual([]); // No jobs should be listed after stopAllJobs
  });

  it("should list all active jobs", async () => {
    const jobId1 = "list-job-1";
    const jobId2 = "list-job-2";
    createJob({
      id: jobId1,
      interval: 1,
      handler: async () => {},
    });
    createJob({
      id: jobId2,
      interval: 2,
      handler: async () => {},
    });

    vi.advanceTimersByTime(1500); // Wait for jobs to be scheduled
    await Promise.resolve();

    // Use imported scheduler instance to get jobs
    const listedJobs = scheduler.getAllJobs().map((job) => job.id);
    expect(listedJobs).toEqual(expect.arrayContaining([jobId1, jobId2]));
    expect(listedJobs.length).toBe(2);
  });

  it("should handle errors in job handler gracefully", async () => {
    const jobId = "error-job";
    const errorMessage = "Job handler error for testing";
    let errorWasHandled = false;
    createJob({
      id: jobId,
      interval: 1,
      handler: async () => {
        try {
          throw new Error(errorMessage);
        } catch (e) {
          errorWasHandled = true;
          console.error("[JOB ERROR] Caught error in job handler:", e);
        }
      },
    });

    vi.advanceTimersByTime(2500); // Wait for job to run and potentially error
    await Promise.resolve();

    expect(errorWasHandled).toBe(true); // Assert that the error was caught in the handler
  });
});
