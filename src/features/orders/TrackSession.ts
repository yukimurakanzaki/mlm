import { cookies } from 'next/headers';
import * as z from 'zod';

const COOKIE = 'mlm_track';
const MAX_AGE_SECONDS = 60 * 60;

const session = z.object({ code: z.string().max(40), phone: z.string().max(30) });

/** Remembers the order lookup for an hour so the phone number never has to appear in a URL. */
export const setTrackSession = async (code: string, phone: string) => {
  (await cookies()).set(COOKIE, JSON.stringify({ code, phone }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
};

export const getTrackSession = async () => {
  const raw = (await cookies()).get(COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    return session.parse(JSON.parse(raw));
  } catch {
    return null;
  }
};
