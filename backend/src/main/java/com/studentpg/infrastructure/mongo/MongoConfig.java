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
