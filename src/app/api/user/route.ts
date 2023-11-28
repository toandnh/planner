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

export async function GET(
	request: Request,
	{ params }: { params: { item: string } }
) {
	if (!params?.item) return NextResponse.json({ message: 'Missing Item' })

	const { Item } = await client.send(
		new GetItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: 'amydnh' },
				Item: { S: 'health' }
			}
		})
	)

	if (!Item) {
		return NextResponse.json({
			message: `Item '${params.item}' not found`
		})
	}

	return NextResponse.json(Item)
}

export async function POST(request: Request) {
	const data = await request.json()

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

export async function PUT(request: Request) {
	const data = await request.json()
	const { name } = data

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: 'guest' },
				Item: { S: 'details' }
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
