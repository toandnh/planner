import { NextResponse } from 'next/server'

import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	providers: [],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			const isOnDashboard =
				nextUrl.pathname === '/' || nextUrl.pathname === '/profile'
			if (isOnDashboard) {
				if (isLoggedIn) return true
				return false // Redirect unauthenticated users to login page
			} else if (isLoggedIn) {
				return NextResponse.redirect(new URL('/', nextUrl)) // Redirect to home page
			}
			return false
		}
	}
} satisfies NextAuthConfig
