package am.ik.blog.config;

import am.ik.blog.entry.EntryRequest;

import org.springframework.aot.hint.ExecutableMode;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportRuntimeHints;

@Configuration(proxyBeanMethods = false)
@ImportRuntimeHints(NativeHints.RuntimeHints.class)
public class NativeHints {

	public static class RuntimeHints implements RuntimeHintsRegistrar {

		@Override
		public void registerHints(org.springframework.aot.hint.RuntimeHints hints, ClassLoader classLoader) {
			try {
				hints.resources().registerPattern("server/*");
				hints.resources().registerPattern("polyfill/*");
				hints.reflection().registerConstructor(EntryRequest.class.getConstructors()[0], ExecutableMode.INVOKE);
			}
			catch (Exception e) {
				throw new RuntimeException(e);
			}
		}

	}

}
