// Mock Prisma client for development
export const prisma = {
  user: {
    findUnique: async () => null,
    create: async () => ({ id: '1', email: 'demo@islamichabits.com', name: 'Demo User' }),
    upsert: async () => ({ id: '1', email: 'demo@islamichabits.com', name: 'Demo User' }),
  },
  habit: {
    create: async () => ({ id: '1', name: 'Mock Habit' }),
    findMany: async () => [],
  },
  achievement: {
    upsert: async () => ({ id: '1', key: 'welcome', title: 'Welcome' }),
  },
  rewardWallet: {
    create: async () => ({ id: '1', nekiBalance: 0 }),
  },
  prayerSetting: {
    create: async () => ({ id: '1', method: 'Karachi' }),
  },
  $disconnect: async () => {},
};