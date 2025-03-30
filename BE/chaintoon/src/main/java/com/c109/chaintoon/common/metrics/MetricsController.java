package com.c109.chaintoon.common.metrics;

import io.micrometer.prometheus.PrometheusMeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MetricsController {
    private static final Logger log  = LoggerFactory.getLogger(MetricsController.class);

    private final PrometheusMeterRegistry prometheusMeterRegistry;

    public MetricsController(PrometheusMeterRegistry prometheusMeterRegistry) {
        log.info("MetricsController constructor ::: {}", prometheusMeterRegistry.scrape());
        this.prometheusMeterRegistry = prometheusMeterRegistry;
    }

    @GetMapping(value = "/metrics.do", produces = "text/plain")
    public ResponseEntity<String> metrics() {
        String metrics = prometheusMeterRegistry.scrape();
        metrics += "\n# EOF";
        //Metrics에 # EOF 추가한 이유 : Grafana 에서 'the spring metrics data does not end with # EOF' 에러로 인해 Metric 정보를 가져오지 못하기 때문

        return ResponseEntity.ok(metrics);
    }
}
