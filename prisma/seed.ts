import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@islamichabits.com' },
    update: {},
    create: {
      email: 'demo@islamichabits.com',
      passwordHash: hashedPassword,
      name: 'Demo User',
      country: 'Bangladesh',
      city: 'Dhaka',
      timezone: 'Asia/Dhaka',
      madhhabAsr: 'Hanafi',
      calcMethod: 'Karachi',
      preferredLanguage: 'en',
    },
  });

  console.log('Created demo user:', demoUser);

  // Create default achievements
  const achievements = [
    {
      key: 'first_signin',
      title: 'Welcome',
      description: 'Created your account',
      icon: '🎉',
    },
    {
      key: 'salah_7_streak',
      title: '7-Day Salah Streak',
      description: 'Completed all 5 prayers for 7 consecutive days',
      icon: '🕌',
    },
    {
      key: 'salah_30_streak',
      title: '30-Day Salah Streak',
      description: 'Completed all 5 prayers for 30 consecutive days',
      icon: '🏆',
    },
    {
      key: 'dhikr_1000',
      title: '1000 Dhikr',
      description: 'Completed 1000 total dhikr/tasbih',
      icon: '📿',
    },
    {
      key: 'duha_10_days',
      title: '10 Days of Duha',
      description: 'Performed Duha prayer for 10 days',
      icon: '🌅',
    },
    {
      key: 'first_monday_fast',
      title: 'First Monday Fast',
      description: 'Completed your first Monday fast',
      icon: '🌙',
    },
    {
      key: 'quran_reader',
      title: 'Quran Reader',
      description: 'Read Quran for 7 consecutive days',
      icon: '📖',
    },
    {
      key: 'charity_giver',
      title: 'Charity Giver',
      description: 'Gave charity 5 times',
      icon: '💝',
    },
    {
      key: 'parent_connection',
      title: 'Parent Connection',
      description: 'Called your parents 10 times',
      icon: '☎️',
    },
    {
      key: 'gratitude_warrior',
      title: 'Gratitude Warrior',
      description: 'Practiced gratitude for 21 days',
      icon: '🙏',
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {},
      create: achievement,
    });
  }

  console.log('Created achievements');

  // Create default habits for demo user
  const defaultHabits = [
    { name: 'Fajr Prayer', type: 'prayer', schedule: '{"type":"daily","time":"05:00"}' },
    { name: 'Dhuhr Prayer', type: 'prayer', schedule: '{"type":"daily","time":"12:30"}' },
    { name: 'Asr Prayer', type: 'prayer', schedule: '{"type":"daily","time":"16:00"}' },
    { name: 'Maghrib Prayer', type: 'prayer', schedule: '{"type":"daily","time":"18:30"}' },
    { name: 'Isha Prayer', type: 'prayer', schedule: '{"type":"daily","time":"20:00"}' },
    { name: 'Witr Prayer', type: 'prayer', schedule: '{"type":"daily","time":"21:30"}' },
    { name: 'Quran Reading', type: 'quran', schedule: '{"type":"daily","duration":15}' },
    { name: 'Morning Adhkar', type: 'dhikr', schedule: '{"type":"daily","time":"06:00"}' },
    { name: 'Evening Adhkar', type: 'dhikr', schedule: '{"type":"daily","time":"18:00"}' },
    { name: 'Durood', type: 'dhikr', schedule: '{"type":"daily","count":100}' },
    { name: 'Duha Prayer', type: 'prayer', schedule: '{"type":"daily","time":"09:00"}' },
    { name: 'Qiyam Prayer', type: 'prayer', schedule: '{"type":"daily","time":"03:00"}' },
    { name: 'Monday Fasting', type: 'fasting', schedule: '{"type":"weekly","day":"monday"}' },
    { name: 'Thursday Fasting', type: 'fasting', schedule: '{"type":"weekly","day":"thursday"}' },
    { name: 'Charity', type: 'charity', schedule: '{"type":"weekly"}' },
    { name: 'Call Parents', type: 'family', schedule: '{"type":"weekly"}' },
    { name: 'Gratitude Journal', type: 'personal', schedule: '{"type":"daily"}' },
    { name: 'Screen Time Limit', type: 'personal', schedule: '{"type":"daily","limit":120}' },
  ];

  for (const habit of defaultHabits) {
    await prisma.habit.create({
      data: {
        ...habit,
        userId: demoUser.id,
        active: true,
      },
    });
  }

  console.log('Created default habits');

  // Create reward wallet for demo user
  await prisma.rewardWallet.create({
    data: {
      userId: demoUser.id,
      nekiBalance: 150,
    },
  });

  console.log('Created reward wallet');

  // Create prayer settings for demo user
  await prisma.prayerSetting.create({
    data: {
      userId: demoUser.id,
      method: 'Karachi',
      asrMadhhab: 'Hanafi',
      highLatRule: 'AngleBased',
      latitude: 23.8103,
      longitude: 90.4125,
      timezone: 'Asia/Dhaka',
      useApiFallback: false,
    },
  });

  console.log('Created prayer settings');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });