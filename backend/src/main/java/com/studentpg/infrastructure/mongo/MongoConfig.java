package com.studentpg.infrastructure.mongo;

import com.studentpg.modules.pg.entity.Gender;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.List;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
                new GenderReadingConverter(),
                new GenderWritingConverter()
        ));
    }

    @Bean
    public org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer() {
        return builder -> builder.applyToConnectionPoolSettings(pool ->
                pool.maxSize(150)
                    .minSize(0)
                    .maxWaitTime(5, java.util.concurrent.TimeUnit.SECONDS)
        ).applyToSocketSettings(socket ->
                socket.connectTimeout(5, java.util.concurrent.TimeUnit.SECONDS)
                      .readTimeout(10, java.util.concurrent.TimeUnit.SECONDS)
        );
    }

    @ReadingConverter
    static class GenderReadingConverter implements Converter<String, Gender> {
        @Override
        public Gender convert(String source) {
            return Gender.parse(source);
        }
    }

    @WritingConverter
    static class GenderWritingConverter implements Converter<Gender, String> {
        @Override
        public String convert(Gender source) {
            return source == null ? null : source.name();
        }
    }
}
