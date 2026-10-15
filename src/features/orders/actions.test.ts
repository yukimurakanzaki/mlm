import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  select: vi.fn(),
  auth: vi.fn(),
  createSnapPayment: vi.fn(),
}));

vi.mock('@/libs/DB', () => ({ db: { transaction: mocks.transaction, select: mocks.select } }));
vi.mock('@clerk/nextjs/server', () => ({ auth: mocks.auth }));
vi.mock('@/libs/Auth', () => ({ isAdmin: vi.fn() }));
vi.mock('@/libs/Logger', () => ({ logger: { error: vi.fn() } }));
vi.mock('@/libs/Midtrans', () => ({ createSnapPayment: mocks.createSnapPayment, isMidtransConfigured: vi.fn() }));
vi.mock('./TrackSession', () => ({ setTrackSession: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`redirect:${url}`);
  },
}));

const { createOrder, payInstallment } = await import('./actions');

describe('partner ordering mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([['id', '/'], ['en', '/en']])('rejects a direct order action in %s before touching stock or auth', async (locale, destination) => {
    const form = new FormData();
    form.set('locale', locale);
    form.set('productId', '1');
    form.set('quantity', '2');

    await expect(createOrder({}, form)).rejects.toThrow(`redirect:${destination}`);
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.auth).not.toHaveBeenCalled();
  });

  it.each([['id', '/'], ['en', '/en']])('rejects a direct checkout action in %s before contacting the gateway', async (locale, destination) => {
    const form = new FormData();
    form.set('locale', locale);
    form.set('paymentId', '1');

    await expect(payInstallment(form)).rejects.toThrow(`redirect:${destination}`);
    expect(mocks.select).not.toHaveBeenCalled();
    expect(mocks.createSnapPayment).not.toHaveBeenCalled();
  });
});
