package com.c109.chaintoon.common.scheduler.task;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.function.Consumer;

@Slf4j
@RequiredArgsConstructor
public class SchedulingTask<T> implements Runnable{
    private final T target; // 작업을 실행할 대상 객체
    private final Consumer<T> task; // 대상에 대해 실행할 작업 정의

    @Override
    public void run() {
        try {
            log.info("스케줄링 태스크 실행 시작 - 대상: {}", target);
            task.accept(target); // 대상에 대해 작업 수행
            log.info("스케줄링 태스크 실행 완료 - 대상: {}", target);
        } catch (Exception e) {
            log.error("스케줄링 태스크 실행 중 오류 발생 - 대상: {} 오류: {}", target, e.getMessage(), e);
        }
    }
}
