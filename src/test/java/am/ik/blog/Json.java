package am.ik.blog;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

public final class Json {

	public static <T> T parse(String json, TypeReference<T> typeReference) {
		return JsonMapper.builder().build().readValue(json, typeReference);
	}

}
