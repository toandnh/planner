import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	GetItemCommand,
	UpdateItemCommand
} from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

export async function GET(
	request: Request,
	{ params }: { params: { item: string } }
) {
	if (!params?.item) return NextResponse.json({ message: 'Missing Item' })

	const { Item } = await client.send(
		new GetItemCommand({
			TableName: process.env.TABLE_NAME!,
			Key: {
				UserID: { S: 'amydnh' },
				Item: { S: params.item }
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

export async function PUT(
	request: Request,
	{ params }: { params: { item: string } }
) {
	if (!params?.item) return NextResponse.json({ message: 'Missing Item' })

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: 'amydnh' },
				Item: { S: params.item }
			},
			UpdateExpression: 'set content = :c',
			ExpressionAttributeValues: {
				':c': { S: await request.json() }
			},
			ReturnValues: 'ALL_NEW'
		})
	)

	return NextResponse.json(Attributes)
}
