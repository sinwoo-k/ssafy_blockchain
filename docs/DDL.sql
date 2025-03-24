-- auction_item: table
CREATE TABLE `auction_item` (
  `auction_item_id` int NOT NULL AUTO_INCREMENT,
  `nft_id` int NOT NULL,
  `bidder_id` int DEFAULT '0',
  `bidding_price` double DEFAULT NULL,
  `buy_now_price` double DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `ended` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sucess` char(1) DEFAULT NULL,
  `success` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`auction_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- comment: table
CREATE TABLE `comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `usage_id` int NOT NULL DEFAULT '0',
  `type` varchar(50) DEFAULT NULL,
  `parent_id` int DEFAULT '0',
  `content` varchar(255) DEFAULT NULL,
  `deleted` varchar(1) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `like_count` bigint DEFAULT NULL,
  `hate_count` bigint DEFAULT NULL,
  `reply_count` bigint DEFAULT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- comment_preference: table
CREATE TABLE `comment_preference` (
  `liked_id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `liked` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`liked_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- episode: table
CREATE TABLE `episode` (
  `episode_id` int NOT NULL AUTO_INCREMENT,
  `webtoon_id` int NOT NULL,
  `episode_name` varchar(50) DEFAULT NULL,
  `writer_comment` varchar(255) DEFAULT NULL,
  `commentable` varchar(255) DEFAULT NULL,
  `upload_date` varchar(10) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `comment_count` bigint DEFAULT NULL,
  `rating_sum` bigint DEFAULT NULL,
  `rating_count` bigint DEFAULT NULL,
  `previous_episode_id` int DEFAULT '0',
  `next_episode_id` int DEFAULT '0',
  `deleted` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`episode_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- episode_image: table
CREATE TABLE `episode_image` (
  `episode_image_id` int NOT NULL AUTO_INCREMENT,
  `episode_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `image_order` int DEFAULT NULL,
  `deleted` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`episode_image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- fanart: table
CREATE TABLE `fanart` (
  `fanart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `webtoon_id` int NOT NULL,
  `fanart_name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `fanart_image` varchar(255) DEFAULT NULL,
  `comment` int DEFAULT '0',
  `deleted` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `like_count` int DEFAULT NULL,
  PRIMARY KEY (`fanart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- fanart_preference: table
CREATE TABLE `fanart_preference` (
  `liked_id` int NOT NULL AUTO_INCREMENT,
  `fanart_id` int NOT NULL,
  `liked` varchar(1) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`liked_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- favorite_webtoon: table
CREATE TABLE `favorite_webtoon` (
  `user_id` int NOT NULL,
  `webtoon_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`webtoon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- following: table
CREATE TABLE `following` (
  `follower_id` int NOT NULL,
  `followee_id` int NOT NULL,
  PRIMARY KEY (`follower_id`,`followee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- goods: table
CREATE TABLE `goods` (
  `goods_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `webtoon_id` int NOT NULL,
  `goods_name` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `goods_image` varchar(255) DEFAULT NULL,
  `deleted` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`goods_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- nft: table
CREATE TABLE `nft` (
  `nft_id` int NOT NULL AUTO_INCREMENT,
  `webtoon_id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `token_id` int DEFAULT '0',
  `contract_address` int DEFAULT '0',
  `metadata_uri` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`nft_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- notice: table
CREATE TABLE `notice` (
  `notice_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `checked` varchar(1) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- rating: table
CREATE TABLE `rating` (
  `episode_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  PRIMARY KEY (`episode_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- tag: table
CREATE TABLE `tag` (
  `webtoon_id` int NOT NULL,
  `tag` varchar(10) NOT NULL,
  PRIMARY KEY (`webtoon_id`,`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- trading_history: table
CREATE TABLE `trading_history` (
  `trading_history_id` int NOT NULL AUTO_INCREMENT,
  `auction_item_id` int NOT NULL,
  `nft_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `trading_value` double DEFAULT NULL,
  `trading_date` varchar(10) DEFAULT NULL,
  `trading_time` varchar(8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`trading_history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- user: table
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `introduction` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `background_image` varchar(255) DEFAULT NULL,
  `follower` int DEFAULT NULL,
  `following` int DEFAULT NULL,
  `join_date` varchar(10) DEFAULT NULL,
  `deleted` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- wallet: table
CREATE TABLE `wallet` (
  `wallet_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(50) NOT NULL,
  `wallet_address` char(42) DEFAULT NULL,
  `private_key` varchar(255) DEFAULT NULL,
  `public_key` varchar(255) DEFAULT NULL,
  `recovery_phrase` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wallet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- webtoon: table
CREATE TABLE `webtoon` (
  `webtoon_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `webtoon_name` varchar(50) DEFAULT NULL,
  `genre` varchar(10) DEFAULT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `adaptable` varchar(1) DEFAULT NULL,
  `garo_thumbnail` varchar(255) DEFAULT NULL,
  `sero_thumbnail` varchar(255) DEFAULT NULL,
  `last_upload_date` varchar(10) DEFAULT NULL,
  `episode_count` bigint DEFAULT NULL,
  `view_count` bigint DEFAULT NULL,
  `rating_sum` bigint DEFAULT NULL,
  `rating_count` bigint DEFAULT NULL,
  `deleted` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`webtoon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
