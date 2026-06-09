declare module "@tanstack/start-client-core" {
  interface ServerFnValidator<_TRegister, _TMethod extends "GET" | "POST", _TMiddlewares, _TStrict extends boolean | { input?: boolean; output?: boolean }> {
    /**
     * Backward-compatible alias for older code using `.inputValidator(...)`.
     * The installed TanStack Start version exposes `.inputValidator(...)`.
     */
    validator: any;
  }

  interface ServerFnBuilder<_TRegister, _TMethod extends "GET" | "POST" = "GET", _TStrict extends boolean | { input?: boolean; output?: boolean } = true> {
    validator: any;
  }

  interface ServerFnAfterMiddleware<_TRegister, _TMethod extends "GET" | "POST", _TMiddlewares, _TInputValidator, _TStrict extends boolean | { input?: boolean; output?: boolean }> {
    validator: any;
  }
}

export {};
