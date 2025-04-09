package com.c109.chaintoon.domain.nft.specification;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.Nft;
import com.c109.chaintoon.domain.webtoon.entity.Webtoon;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import java.util.List;

public class AuctionItemSpecification {
    public static Specification<AuctionItem> hasBlockchainSuccess() {
        return (root, query, cb) -> cb.equal(root.get("blockchainStatus"), "SUCCESS");
    }

    public static Specification<AuctionItem> hasType(String type) {
        return (root, query, cb) -> cb.equal(root.get("type"), type);
    }

    public static Specification<AuctionItem> hasWebtoonId(Integer webtoonId) {
        return (root, query, cb) -> {
            if (webtoonId == null) return cb.conjunction();

            Root<Nft> nftRoot = query.from(Nft.class); // Nft 테이블 조인
            Predicate joinCondition = cb.equal(root.get("nftId"), nftRoot.get("nftId"));
            Predicate webtoonCondition = cb.equal(nftRoot.get("webtoonId"), webtoonId);

            return cb.and(joinCondition, webtoonCondition);
        };
    }

    public static Specification<AuctionItem> hasEnded(String ended) {
        return (root, query, cb) -> StringUtils.hasText(ended) ?
                cb.equal(root.get("ended"), ended) :
                cb.conjunction();
    }

    public static Specification<AuctionItem> hasGenres(List<String> genres) {
        return (root, query, cb) -> {
            if (genres == null || genres.isEmpty()) {
                return cb.conjunction(); // 조건 무시
            }

            // 1. Nft 테이블 조인
            Root<Nft> nftRoot = query.from(Nft.class);
            Predicate joinAuctionToNft = cb.equal(root.get("nftId"), nftRoot.get("nftId"));

            // 2. Webtoon 테이블 조인
            Root<Webtoon> webtoonRoot = query.from(Webtoon.class);
            Predicate joinNftToWebtoon = cb.equal(nftRoot.get("webtoonId"), webtoonRoot.get("webtoonId"));

            // 3. genres 조건 적용
            Predicate genrePredicate = webtoonRoot.get("genre").in(genres);

            // 모든 조건 결합
            return cb.and(joinAuctionToNft, joinNftToWebtoon, genrePredicate);
        };
    }
}