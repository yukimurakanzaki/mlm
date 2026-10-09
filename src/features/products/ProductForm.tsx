import type { productSchema } from '@/models/Schema';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { saveProduct } from './actions';

const inputClass = 'mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm';

/** Create (no `product`) or edit form for a catalog product. */
export const ProductForm = async (props: { product?: typeof productSchema.$inferSelect; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'AdminProducts' });
  const { product } = props;

  return (
    <form
      action={saveProduct}
      className="
        grid gap-3
        sm:grid-cols-2
      "
    >
      {product && <input type="hidden" name="id" value={product.id} />}

      <label className="
        block text-sm font-medium
        sm:col-span-2
      "
      >
        {t('name')}
        <input name="name" required minLength={2} maxLength={120} defaultValue={product?.name} className={inputClass} />
      </label>
      <label className="
        block text-sm font-medium
        sm:col-span-2
      "
      >
        {t('description')}
        <textarea name="description" rows={2} maxLength={1000} defaultValue={product?.description} className={inputClass} />
      </label>
      <label className="block text-sm font-medium">
        {t('price')}
        <input name="priceIdr" type="number" required min={1000} step={1} defaultValue={product?.priceIdr} className={inputClass} />
      </label>
      <label className="block text-sm font-medium">
        {t('stock')}
        <input name="stock" type="number" required min={0} step={1} defaultValue={product?.stock ?? 0} className={inputClass} />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} />
        {t('active')}
      </label>
      <div className="sm:text-right">
        <Button type="submit" size="sm">{product ? t('save') : t('add')}</Button>
      </div>
    </form>
  );
};
