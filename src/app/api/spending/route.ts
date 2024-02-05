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
	const item = 'spending'

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		return NextResponse.json({ message: 'Missing userID!' })

	const searchParams = new URL(req.url as string).searchParams
	const startTime = searchParams.get('start-time') as string
	const endTime = searchParams.get('end-time') as string

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
				'#date': 'Date'
			},
			ProjectionExpression: '#i, Spending, Amount, Category, #date'
		})
	)

	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found!`
		})
	}

	const results: SpendingDatum[] = []
	Items.map((item) => {
		let currItem = {
			item: item.Item.S!,
			spending: item.Spending.S!,
			amount: item.Amount.N!,
			category: item.Category.S!,
			date: item.Date.N!
		}
		results.push(currItem)
	})

	return NextResponse.json(results)
}

export async function POST(req: Request) {
	const data = await req.json()

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, spending, amount, category, date } = data

	await client.send(
		new PutItemCommand({
			TableName: process.env.TABLE_NAME,
			Item: {
				UserID: { S: userId as string },
				Item: { S: item as string },
				Spending: { S: spending as string },
				Amount: { N: `${amount}` as string },
				Category: { S: category as string },
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

	const { item, spending, amount, category } = data

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			UpdateExpression: 'SET Spending = :sp, Amount = :am, Category = :cat',
			ExpressionAttributeValues: {
				':sp': { S: spending },
				':am': { N: amount },
				':cat': { S: category }
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
