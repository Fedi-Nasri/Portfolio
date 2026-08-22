CREATE TABLE "portfolio_media_assets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "portfolio_media_assets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"storageProvider" varchar(40) DEFAULT 'vercel-blob' NOT NULL,
	"storageKey" text NOT NULL,
	"url" text NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"contentType" varchar(120) NOT NULL,
	"category" varchar(40) NOT NULL,
	"sizeBytes" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_media_assets_storageKey_unique" UNIQUE("storageKey")
);
