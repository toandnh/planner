import { NextResponse } from 'next/server'

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

import bcrypt from 'bcrypt'

const saltRounds = 10

const client = new DynamoDBClient({})

export async function POST(req: Request) {
	const data = await req.json()

	const { userId, password, name } = data
	if (!userId || !password)
		NextResponse.json({ message: 'Missing userId and/or password!' })

	const Item = {
		// Required
		UserID: { S: userId },
		Item: { S: 'details' },

		Password: { S: await bcrypt.hash(password, saltRounds) },

		// Other
		Name: { S: name }
	}
	await client.send(
		new PutItemCommand({
			TableName: process.env.TABLE_NAME,
			Item
		})
	)

	return NextResponse.json({
		message: `User ${userId} successfully created!`
	})
}
