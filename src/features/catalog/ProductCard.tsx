import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Link } from '@/libs/I18nNavigation';
import { formatIDR } from '@/utils/Orders';

type Product = {
  slug: string;
  name: string;
  description: string;
  priceIdr: number;
  stock: number;
};

export const ProductCard = async (props: { product: Product; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Catalog' });
  const { product } = props;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <div
        className="
          flex h-40 items-center justify-center bg-linear-to-br from-indigo-500
          via-purple-500 to-pink-500 text-5xl font-bold text-white
        "
        aria-hidden="true"
      >
        {product.name.charAt(0)}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-3 text-xl font-bold">{formatIDR(product.priceIdr, props.locale)}</div>

        {product.stock > 0
          ? (
              <Link className={buttonVariants({ className: 'mt-3' })} href={`/catalog/${product.slug}`}>
                {t('order_now')}
              </Link>
            )
          : (
              <div className="
                mt-3 text-center text-sm font-medium text-destructive
              "
              >
                {t('out_of_stock')}
              </div>
            )}
      </div>
    </div>
  );
};
