import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	PutItemCommand,
	UpdateItemCommand,
	DeleteItemCommand
} from '@aws-sdk/client-dynamodb'

import { auth } from '@/auth'

const client = new DynamoDBClient({})

export async function GET(req: Request) {
	const item = 'health#calorie'

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		return NextResponse.json({ message: 'Missing userID!' })

	const searchParams = new URL(req.url as string).searchParams
	const startTime = searchParams.get('start-time') as string
	const endTime = searchParams.get('end-time') as string

	// Get all the items in the request time period
	const { Items } = await client.send(
		new QueryCommand({
			TableName: process.env.TABLE_NAME as string,
			KeyConditionExpression: '#uid = :UserID AND begins_with(#i, :Item)',
			FilterExpression: '#date BETWEEN :sTime AND :eTime',
			ExpressionAttributeValues: {
				':UserID': { S: userId },
				':Item': { S: item },
				':sTime': { N: startTime },
				':eTime': { N: endTime }
			},
			ExpressionAttributeNames: {
				'#uid': 'UserID',
				'#i': 'Item',
				'#date': 'Date',
				'#c': 'Consumed'
			},
			ProjectionExpression: '#i, Activity, #c, Amount, #date'
		})
	)

	// Get the oldest record with this sort key
	const { Items: FirstItem } = await client.send(
		new QueryCommand({
			TableName: process.env.TABLE_NAME as string,
			KeyConditionExpression: '#uid = :UserID AND begins_with(#i, :Item)',
			ExpressionAttributeValues: {
				':UserID': { S: userId },
				':Item': { S: item }
			},
			ExpressionAttributeNames: {
				'#uid': 'UserID',
				'#i': 'Item',
				'#date': 'Date',
				'#c': 'Consumed'
			},
			ProjectionExpression: '#i, Activity, #c, Amount, #date',
			ScanIndexForward: true,
			Limit: 1
		})
	)

	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Items begin with '${item}' from user '${userId}' not found!`
		})
	}

	let hasFirstItem = false
	Items.map((item) => {
		hasFirstItem = item.Item.S == FirstItem![0].Item.S ? true : hasFirstItem
	})

	const results: CalorieDatum[] = []
	Items.map((item) => {
		let currItem = {
			item: item.Item.S!,
			consumed: item.Consumed.BOOL!,
			activity: item.Activity.S!,
			amount: item.Amount.N!,
			date: item.Date.N!
		}
		results.push(currItem)
	})

	return NextResponse.json({ results, hasFirstItem })
}

export async function POST(req: Request) {
	const data = await req.json()

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, activity, consumed, amount, date } = data

	await client.send(
		new PutItemCommand({
			TableName: process.env.TABLE_NAME,
			Item: {
				UserID: { S: userId as string },
				Item: { S: item as string },
				Activity: { S: activity as string },
				Consumed: { BOOL: consumed as boolean },
				Amount: { N: `${amount}` as string },
				Date: { N: `${date}` as string }
			}
		})
	)

	return NextResponse.json({
		message: `Item ${item} successfully created!`
	})
}

export async function PUT(req: Request) {
	const data = await req.json()

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, activity, amount } = data

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			UpdateExpression: 'SET Activity = :ac, Amount = :am',
			ExpressionAttributeValues: {
				':ac': { S: activity },
				':am': { N: amount }
			},
			ReturnValues: 'ALL_NEW'
		})
	)

	return NextResponse.json(Attributes)
}

export async function DELETE(req: Request) {
	const data = await req.json()

	const session = await auth()
	const userId = session?.user.id

	const { item } = data

	if (!userId || userId === null || !item || item === null)
		NextResponse.json({ message: 'Missing data!' })

	const { Attributes } = await client.send(
		new DeleteItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			ReturnValues: 'ALL_OLD'
		})
	)

	return NextResponse.json(Attributes)
}
