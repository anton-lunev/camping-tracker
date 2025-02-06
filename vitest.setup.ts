import { beforeAll, afterAll, afterEach, vi } from 'vitest'

beforeAll(() => {
  // Setup any test environment variables
  process.env.TELEGRAM_API_TOKEN = 'test-token'
  process.env.TELEGRAM_CHAT_ID = 'test-chat-id'
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  // Clean up after all tests
}) 