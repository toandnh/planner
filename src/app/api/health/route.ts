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
			ProjectionExpression: 'Gender, Birthyear, Height, Weight, Activity, Goal'
		})
	)

	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found!`
		})
	}

	let result: HealthData = {
		gender: Items[0].Gender.S!,
		birthYear: Items[0].Birthyear.N!,
		height: Items[0].Height.N!,
		weight: Items[0].Weight.N!,
		activity: Items[0].Activity.S!,
		goal: Items[0].Goal.S!
	}

	return NextResponse.json(result)
}

export async function PUT(req: Request) {
	const data = await req.json()

	const session = await auth()
	const userId = session?.user.id

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, gender, birthYear, height, weight, goal, activity } = data

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			UpdateExpression:
				'SET Gender = :gd, Birthyear = :by, Height = :h, Weight = :w, Activity = :ac, Goal = :go',
			ExpressionAttributeValues: {
				':gd': { S: gender },
				':by': { N: birthYear },
				':h': { N: height },
				':w': { N: weight },
				':ac': { S: activity },
				':go': { S: goal }
			},
			ReturnValues: 'ALL_NEW'
		})
	)

	return NextResponse.json(Attributes)
}
