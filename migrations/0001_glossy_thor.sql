ALTER TABLE "product" ALTER COLUMN "price_idr" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "sku" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "brand" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "packaging" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "unit" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "show_price" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "track_stock" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_sku_unique" UNIQUE("sku");