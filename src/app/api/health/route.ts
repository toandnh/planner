import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	UpdateItemCommand
} from '@aws-sdk/client-dynamodb'

import { auth } from '@/auth'

const client = new DynamoDBClient({})

export async function GET(req: Request) {
	const item = 'health'

	const session = await auth()
	const userId = session?.user.id

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
				'#i': 'Item'
			},
			ProjectionExpression: 'Gender, Height, Weight, Goal, Amount'
		})
	)

	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found!`
		})
	}

	let result: HealthDatum = {
		gender: Items[0].Gender.S!,
		height: Items[0].Height.N!,
		weight: Items[0].Weight.N!,
		goal: Items[0].Goal.S!,
		amount: Items[0].Amount.N!
	}

	return NextResponse.json(result)
}

export async function PUT(req: Request) {
	const data = await req.json()

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, gender, height, weight, goal, amount } = data

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			UpdateExpression:
				'SET Gender = :gd, Height = :h, Weight = :w, Goal = :go, Amount = :am',
			ExpressionAttributeValues: {
				':gd': { S: gender },
				':h': { N: height },
				':w': { N: weight },
				':go': { S: goal },
				':am': { N: amount }
			},
			ReturnValues: 'ALL_NEW'
		})
	)

	return NextResponse.json(Attributes)
}
