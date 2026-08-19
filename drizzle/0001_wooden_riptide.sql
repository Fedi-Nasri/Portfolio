CREATE TABLE `portfolio_draft_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`draftId` int NOT NULL,
	`versionNumber` int NOT NULL,
	`contentJson` json NOT NULL,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_draft_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_drafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`draftKey` varchar(64) NOT NULL,
	`name` varchar(120) NOT NULL,
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdBy` int NOT NULL,
	`updatedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_drafts_id` PRIMARY KEY(`id`),
	CONSTRAINT `portfolio_drafts_draftKey_unique` UNIQUE(`draftKey`)
);
