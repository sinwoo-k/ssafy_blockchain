package com.c109.chaintoon.common.scheduler.service;

import com.c109.chaintoon.common.scheduler.task.SchedulingTask;
import com.c109.chaintoon.domain.nft.service.AuctionItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class SchedulingService {
    private final ThreadPoolTaskScheduler taskScheduler;
//    private final AuctionItemService auctionItemService;

    // 제네릭 작업을 지정된 실행 시간에 예약하는 메서드
    public <T> void scheduleTask(T target, Consumer<T> task, LocalDateTime executionTime) {
        SchedulingTask<T> schedulingTask = new SchedulingTask<>(target, task);
        Date executionDate = Date.from(executionTime.atZone(ZoneId.systemDefault()).toInstant());
        taskScheduler.schedule(schedulingTask, executionDate);
    }

    public void scheduleAuctionEnd(Integer auctionItemId, LocalDateTime endTime, Consumer<Integer> auctionEndTask) {
       // Consumer<Integer> auctionEndTask = auctionItemService::selectAuctionWinner;
        scheduleTask(auctionItemId, auctionEndTask, endTime);
    }

}
