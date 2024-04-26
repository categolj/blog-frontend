package am.ik.blog;

import java.io.UncheckedIOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

public final class Json {

	public static <T> T parse(String json, TypeReference<T> typeReference) {
		try {
			return Jackson2ObjectMapperBuilder.json().build().readValue(json, typeReference);
		}
		catch (JsonProcessingException e) {
			throw new UncheckedIOException(e);
		}
	}

}
