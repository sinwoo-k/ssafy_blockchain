package com.c109.chaintoon.domain.nft.specification;

import com.c109.chaintoon.domain.nft.entity.AuctionItem;
import com.c109.chaintoon.domain.nft.entity.Nft;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

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
}