import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface NextAuthOptions {
		providers: Provider[]
		secret?: string
		session?: Partial<SessionOptions>
		jwt?: Partial<JWTOptions>
		pages?: Partial<PagesOptions>
		callbacks?: Partial<CallbacksOptions>
		events?: Partial<EventCallbacks>
		adapter?: Adapter
		debug?: boolean
		logger?: Partial<LoggerInstance>
		theme?: Theme
		useSecureCookies?: boolean
		cookies?: Partial<CookiesOptions>
	}
	interface Session {
		user: {
			id: string
			name: string
		} & DefaultSession['user']
	}
}
