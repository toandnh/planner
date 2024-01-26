import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	UpdateItemCommand
} from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

export async function GET(req: Request) {
	const item = 'details'

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')

	// userId type is (string | null),
	// !userId checks for empty string,
	// userId === null checks for null value
	if (!userId || userId === null)
		return NextResponse.json({ message: 'Missing userID!' })

	const { Items } = await client.send(
		new QueryCommand({
			TableName: process.env.TABLE_NAME as string,
			KeyConditionExpression: '#uid = :UserID AND #i = :Item',
			ExpressionAttributeValues: {
				':UserID': { S: userId },
				':Item': { S: item }
			},
			ExpressionAttributeNames: {
				'#uid': 'UserID',
				'#i': 'Item',
				'#n': 'Name'
			},
			ProjectionExpression: '#n'
		})
	)

	// Items type is Record<string, AttributeValue>[] | undefined,
	// !Items ensures 'Items' is not undefined,
	// Object.keys(Items).length <= 0, because dynamodb returns an empty object if item does not exist
	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found!`
		})
	}

	return NextResponse.json(Items[0].Name.S)
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
