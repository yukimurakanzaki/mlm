import { getTranslations } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Link } from '@/libs/I18nNavigation';
import { canOrderOnline, formatIDR } from '@/utils/Orders';

type Product = {
  slug: string;
  name: string;
  description: string;
  brand: string | null;
  packaging: string | null;
  priceIdr: number | null;
  showPrice: boolean;
  trackStock: boolean;
  stock: number;
};

export const ProductCard = async (props: { product: Product; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Catalog' });
  const { product } = props;
  const orderable = canOrderOnline(product);
  const soldOut = product.trackStock && product.stock <= 0;
  const details = [product.brand, product.packaging].filter(Boolean).join(' · ');

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
        {details && <div className="mt-0.5 text-xs text-muted-foreground">{details}</div>}
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{product.description}</p>
        <div className={orderable
          ? 'mt-3 text-xl font-bold'
          : `mt-3 text-sm font-medium text-muted-foreground`}
        >
          {orderable ? formatIDR(product.priceIdr, props.locale) : t('price_on_request')}
        </div>

        {orderable && soldOut
          ? (
              <div className="
                mt-3 text-center text-sm font-medium text-destructive
              "
              >
                {t('out_of_stock')}
              </div>
            )
          : (
              <Link className={buttonVariants({ className: 'mt-3', variant: orderable ? 'default' : 'outline' })} href={`/catalog/${product.slug}`}>
                {orderable ? t('order_now') : t('request_quote')}
              </Link>
            )}
      </div>
    </div>
  );
};
