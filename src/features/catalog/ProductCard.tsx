import { ArrowRightIcon } from '@radix-ui/react-icons';
import { getTranslations } from 'next-intl/server';
import { ProductImage } from '@/features/catalog/ProductImage';
import { Link } from '@/libs/I18nNavigation';
import { canOrderOnline, formatIDR } from '@/utils/Orders';

type Product = {
  slug: string;
  name: string;
  description: string;
  packaging: string | null;
  priceIdr: number | null;
  showPrice: boolean;
  trackStock: boolean;
  stock: number;
  imageUrl: string | null;
};

/** Whole card is one link to the product page; the bottom line says what happens there (order, quote or sold out). */
export const ProductCard = async (props: { product: Product; locale: string }) => {
  const t = await getTranslations({ locale: props.locale, namespace: 'Catalog' });
  const { product } = props;
  const orderable = canOrderOnline(product);
  const soldOut = orderable && product.trackStock && product.stock <= 0;

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="
        group flex flex-col border bg-card transition-colors
        hover:border-foreground/40
      "
    >
      <ProductImage
        name={product.name}
        imageUrl={product.imageUrl}
        className="aspect-4/3 border-b bg-secondary"
      />

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base/snug font-bold">{product.name}</h3>
        {product.packaging && (
          <div className="mt-1 font-mono text-[11px] text-muted-foreground">
            {product.packaging}
          </div>
        )}
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{product.description}</p>

        <div className="
          mt-4 flex items-center justify-between gap-3 border-t pt-3 text-sm
        "
        >
          {soldOut
            ? <span className="font-medium text-destructive">{t('out_of_stock')}</span>
            : orderable
              ? <span className="font-bold">{formatIDR(product.priceIdr, props.locale)}</span>
              : <span className="font-semibold">{t('request_quote')}</span>}
          <ArrowRightIcon className="
            shrink-0 transition-transform
            group-hover:translate-x-0.5
          "
          />
        </div>
      </div>
    </Link>
  );
};
