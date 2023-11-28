'use server'

import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { z } from 'zod'
import bcrypt from 'bcrypt'

import { authConfig } from '@/auth.config'

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

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
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
					if (passwordsMatch) return user
				}
				return null
			}
		})
	]
})
