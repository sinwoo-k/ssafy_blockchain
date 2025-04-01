package com.c109.chaintoon.common.metrics.config;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.core.instrument.binder.jvm.ClassLoaderMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import io.micrometer.core.instrument.binder.system.UptimeMetrics;

import org.springframework.format.FormatterRegistry;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.validation.MessageCodesResolver;
import org.springframework.validation.Validator;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.util.List;

@Configuration
public class MetricsConfig {

    @Bean
    public PrometheusMeterRegistry prometheusMeterRegistry() {
        PrometheusMeterRegistry registry = new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);

        // 다양한 JVM 메트릭을 registry에 바인딩
        new ClassLoaderMetrics().bindTo(registry);  // 클래스 로더 관련 메트릭
        new JvmMemoryMetrics().bindTo(registry);    // JVM 메모리 관련 메트릭
        new JvmThreadMetrics().bindTo(registry);    // JVM 스레드 관련 메트릭
        new ProcessorMetrics().bindTo(registry);    // CPU 프로세서 관련 메트릭
        new UptimeMetrics().bindTo(registry);       // 애플리케이션의 uptime 메트릭

        // 메트릭을 PrometheusMeterRegistry에 바인딩한 후, 이를 반환
        return registry;
    }

    @Bean
    public WebMvcConfigurer metricsEndpointConfigurer(PrometheusMeterRegistry prometheusMeterRegistry) {
        return new WebMvcConfigurer() {
            @Override
            public void configurePathMatch(PathMatchConfigurer configurer) {
                // 필요한 경우 이곳에서 경로 매칭 설정
            }

            @Override
            public void configureContentNegotiation(ContentNegotiationConfigurer contentNegotiationConfigurer) {}

            @Override
            public void configureAsyncSupport(AsyncSupportConfigurer asyncSupportConfigurer) {}

            @Override
            public void configureDefaultServletHandling(DefaultServletHandlerConfigurer defaultServletHandlerConfigurer) {}

            @Override
            public void addFormatters(FormatterRegistry formatterRegistry) {}

            @Override
            public void addInterceptors(InterceptorRegistry interceptorRegistry) {}

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/actuator/prometheus")
                        .addResourceLocations("classpath:/metrics");
            }

            @Override
            public void addCorsMappings(CorsRegistry corsRegistry) {
                corsRegistry.addMapping("/metrics.do").allowedOrigins("*");
            }

            @Override
            public void addViewControllers(ViewControllerRegistry viewControllerRegistry) {}

            @Override
            public void configureViewResolvers(ViewResolverRegistry viewResolverRegistry) {}

            @Override
            public void addArgumentResolvers(List<HandlerMethodArgumentResolver> list) {}

            @Override
            public void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> list) {}

            @Override
            public void configureMessageConverters(List<HttpMessageConverter<?>> list) {}

            @Override
            public void extendMessageConverters(List<HttpMessageConverter<?>> list) {}

            @Override
            public void configureHandlerExceptionResolvers(List<HandlerExceptionResolver> list) {}

            @Override
            public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> list) {}

            @Override
            public Validator getValidator() {
                return null;
            }

            @Override
            public MessageCodesResolver getMessageCodesResolver() {
                return null;
            }
        };
    }
}
