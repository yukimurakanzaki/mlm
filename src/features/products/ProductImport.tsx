'use client';

import type { ImportState } from './actions';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { importProducts } from './actions';

/** Upload a catalog sheet (CSV) to add or update many products at once. */
export const ProductImport = () => {
  const t = useTranslations('AdminProducts');
  const [state, formAction, pending] = useActionState<ImportState, FormData>(importProducts, {});
  const errors = state.errors ?? [];

  return (
    <form action={formAction} className="space-y-3">
      <p className="text-sm text-muted-foreground">{t('import_hint')}</p>
      <input
        name="file"
        type="file"
        accept=".csv,text/csv"
        required
        aria-label={t('import_file')}
        className="block text-sm"
      />
      <Button type="submit" size="sm" disabled={pending}>{pending ? t('importing') : t('import_button')}</Button>

      {state.done && (
        <p role="status" className="text-sm text-green-700">
          {t('import_result', { created: state.created ?? 0, updated: state.updated ?? 0 })}
        </p>
      )}
      {state.failed && <p role="alert" className="text-sm text-destructive">{t('import_failed')}</p>}
      {errors.length > 0 && (
        <div role="alert" className="text-sm text-destructive">
          <p>{t('import_skipped', { count: errors.length })}</p>
          <ul className="list-disc pl-5">
            {errors.slice(0, 20).map(error => (
              <li key={`${error.row}-${error.field}`}>{t('import_error', { row: error.row, field: error.field })}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};
