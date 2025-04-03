package com.c109.chaintoon.domain.nft.dto.blockchain.wrapper;

import com.c109.chaintoon.domain.nft.dto.blockchain.item.TransactionItem;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionListWrapper {
    private boolean success;
    private List<TransactionItem> data;
}
