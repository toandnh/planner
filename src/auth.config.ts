import { NextResponse } from 'next/server'

import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	providers: [],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			console.log(nextUrl.pathname)
			const isLoggedIn = !!auth?.user
			const isOnDashboard =
				nextUrl.pathname === '/' || nextUrl.pathname === '/profile'
			if (isOnDashboard) {
				if (isLoggedIn) return true
				return false // Redirect unauthenticated users to login page
			} else if (isLoggedIn) {
				console.log('logged in')
				return NextResponse.redirect(new URL('/', nextUrl)) // Redirect to home page
			}
			return true
		}
	}
} satisfies NextAuthConfig
