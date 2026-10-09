import { currentUser } from '@clerk/nextjs/server';

/**
 * Admins are Clerk users whose public metadata contains `{ "role": "admin" }`.
 * Set it in the Clerk dashboard (Users -> user -> Metadata -> Public).
 */
export const isAdmin = async () => {
  const user = await currentUser();

  return user?.publicMetadata?.role === 'admin';
};
