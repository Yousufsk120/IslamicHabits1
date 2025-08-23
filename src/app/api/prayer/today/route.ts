import { NextRequest, NextResponse } from 'next/server';
import { calculatePrayerTimes, getNextPrayer, type PrayerTimesConfig } from '@/lib/prayer-times';
import { z } from 'zod';

const querySchema = z.object({
  lat: z.string().transform(Number),
  lng: z.string().transform(Number), 
  tz: z.string().default('UTC'),
  method: z.string().default('Karachi'),
  asr: z.enum(['Hanafi', 'Shafi']).default('Hanafi'),
  highLat: z.string().default('AngleBased'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      lat: searchParams.get('lat') || '23.8103',
      lng: searchParams.get('lng') || '90.4125', 
      tz: searchParams.get('tz') || 'Asia/Dhaka',
      method: searchParams.get('method') || 'Karachi',
      asr: searchParams.get('asr') || 'Hanafi',
      highLat: searchParams.get('highLat') || 'AngleBased',
    });

    const config: PrayerTimesConfig = {
      latitude: query.lat,
      longitude: query.lng,
      timezone: query.tz,
      calculationMethod: query.method,
      madhhabAsr: query.asr,
      highLatitudeRule: query.highLat,
    };

    const today = new Date();
    const prayerTimes = calculatePrayerTimes(config, today);
    const nextPrayer = getNextPrayer(prayerTimes);

    return NextResponse.json({
      date: today.toISOString().split('T')[0],
      location: {
        latitude: query.lat,
        longitude: query.lng,
        timezone: query.tz,
      },
      method: query.method,
      asr: query.asr,
      times: {
        fajr: prayerTimes.fajr.toISOString(),
        sunrise: prayerTimes.sunrise.toISOString(),
        dhuhr: prayerTimes.dhuhr.toISOString(),
        asr: prayerTimes.asr.toISOString(),
        maghrib: prayerTimes.maghrib.toISOString(),
        isha: prayerTimes.isha.toISOString(),
      },
      nextPrayer: {
        name: nextPrayer.name,
        time: nextPrayer.time.toISOString(),
        remaining: nextPrayer.remaining,
      },
    });
  } catch (error) {
    console.error('Prayer times API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate prayer times' },
      { status: 500 }
    );
  }
}