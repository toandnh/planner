import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	PutItemCommand,
	UpdateItemCommand
} from '@aws-sdk/client-dynamodb'

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

export async function PUT(req: Request) {
	const data = await req.json()
	const { name } = data

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')
	const item = searchParams.get('item')

	if (!userId || !item) return NextResponse.json({ message: 'Missing data!' })

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			UpdateExpression: 'set name = :n',
			ExpressionAttributeValues: {
				':n': { S: name }
			},
			ReturnValues: 'ALL_NEW'
		})
	)

	return NextResponse.json(Attributes)
}
