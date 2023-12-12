import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
	UpdateItemCommand
} from '@aws-sdk/client-dynamodb'

import bcrypt from 'bcrypt'

const client = new DynamoDBClient({})

const saltRounds = 10

export async function GET(req: NextApiRequest) {
	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')
	const item = searchParams.get('item')

	if (!userId || !item) return NextResponse.json({ message: 'Missing data' })

	const { Item } = await client.send(
		new GetItemCommand({
			TableName: process.env.TABLE_NAME as string,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			ExpressionAttributeNames: { '#i': 'Item', '#n': 'Name' },
			ProjectionExpression: 'UserID, #i, #n'
		})
	)

	if (!Item) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found`
		})
	}

	return NextResponse.json(Item)
}

export async function PUT(req: Request) {
	const data = await req.json()
	const { name } = data

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')
	const item = searchParams.get('item')

	if (!userId || !item) return NextResponse.json({ message: 'Missing data' })

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

export async function POST(req: Request) {
	const data = await req.json()

	const { username, password, name } = data
	if (!username || !password)
		NextResponse.json({ message: 'Missing username and/or password!' })

	const Item = {
		// Required
		UserID: { S: username },
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
		message: `User ${username} successfully created!`
	})
}
