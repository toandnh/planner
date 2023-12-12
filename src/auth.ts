import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoDBAdapter } from '@auth/dynamodb-adapter'

import NextAuth from 'next-auth'

import type { Session } from 'next-auth'

import Credentials from 'next-auth/providers/credentials'

import { z } from 'zod'
import bcrypt from 'bcrypt'

import { authConfig } from './auth.config'

const config: DynamoDBClientConfig = {
	credentials: {
		accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY!,
		secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY!
	},
	region: process.env.NEXT_AUTH_AWS_REGION
}

const client = DynamoDBDocument.from(new DynamoDB(config), {
	marshallOptions: {
		convertEmptyValues: true,
		removeUndefinedValues: true,
		convertClassInstanceToMap: true
	}
})

async function getUser(userID: string): Promise<any | undefined> {
	try {
		const userItem = 'details'
		const client = new DynamoDBClient({})
		const { Item } = await client.send(
			new GetItemCommand({
				TableName: process.env.TABLE_NAME,
				Key: {
					UserID: { S: userID },
					Item: { S: userItem }
				}
			})
		)
		return Item
	} catch (error) {
		console.error('Failed to fetch user:', error)
		throw new Error('Failed to fetch user.')
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	adapter: DynamoDBAdapter(client),
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						username: z.string().min(5).max(20),
						password: z.string().min(8)
					})
					.safeParse(credentials)
				if (parsedCredentials.success) {
					const { username, password } = parsedCredentials.data
					const user = await getUser(username)
					if (!user) return null
					const passwordsMatch = await bcrypt.compare(password, user.Password.S)
					if (passwordsMatch) return { id: user.UserID.S, name: user.Name.S }
				}
				return null
			}
		})
	],
	callbacks: {
		async jwt({
			token,
			account,
			user
		}: {
			token: any
			account: any
			user: any
		}) {
			if (account) {
				token.accessToken = account.access_token
				token.id = user.id
				token.name = user.name
			}
			return token
		},
		async session({ session, token }: { session: Session; token: any }) {
			session.user.id = token.id
			session.user.name = token.name
			return session
		}
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
	secret: process.env.NEXTAUTH_SECRET
})
