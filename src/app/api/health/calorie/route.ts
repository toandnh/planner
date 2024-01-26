import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	PutItemCommand,
	UpdateItemCommand,
	DeleteItemCommand
} from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

export async function GET(req: Request) {
	const item = 'health#calorie'
	const MilliSecInADay = 24 * 60 * 60 * 1000

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')

	if (!userId || userId === null)
		return NextResponse.json({ message: 'Missing userID!' })

	const timePeriod = searchParams.get('time-period')

	const startTime = searchParams.get('start-time') as string

	let tempTime
	switch (timePeriod) {
		case 'month':
			tempTime = parseInt(startTime) + 30 * MilliSecInADay - 1
			break
		case 'week':
			tempTime = parseInt(startTime) + 7 * MilliSecInADay - 1
			break
		case 'day':
			tempTime = parseInt(startTime) + 1 * MilliSecInADay - 1
			break
		default:
			tempTime = parseInt(startTime)
			break
	}

	const endTime = new Date(tempTime).getTime().toString()

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
			ProjectionExpression: '#i, Activity, #c, Amount'
		})
	)

	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Items begin with '${item}' from user '${userId}' not found!`
		})
	}

	const results: CalorieDatum[] = []
	Items.map((item) => {
		let currItem = {
			item: item.Item.S!,
			consumed: item.Consumed.BOOL!,
			activity: item.Activity.S!,
			amount: item.Amount.N!
		}
		results.push(currItem)
	})

	return NextResponse.json(results)
}

export async function POST(req: Request) {
	const data = await req.json()

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, activity, consumed, amount } = data

	await client.send(
		new PutItemCommand({
			TableName: process.env.TABLE_NAME,
			Item: {
				UserID: { S: userId as string },
				Item: { S: item as string },
				Activity: { S: activity as string },
				Consumed: { BOOL: consumed as boolean },
				Amount: { N: `${amount}` as string }
			}
		})
	)

	return NextResponse.json({
		message: `Item ${item} successfully created!`
	})
}

export async function PUT(req: Request) {
	//
}

export async function DELETE(req: Request) {
	//
}
