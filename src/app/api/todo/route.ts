import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	PutItemCommand
} from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

declare type QueryResults = {
	item: string | undefined
	name: string | undefined
	completed: boolean | undefined
	priority: string | undefined
	task: string | undefined
}

export async function GET(req: NextApiRequest) {
	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')
	const item = searchParams.get('item')

	if (!userId || !item) return NextResponse.json({ message: 'Missing data!' })

	const { Items } = await client.send(
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
				'#n': 'Name'
			},
			ProjectionExpression: '#i, #n, Completed, Priority, Task'
		})
	)

	if (!Items) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found!`
		})
	}

	const results: QueryResults[] = []
	Items.map((item) => {
		let currItem = {
			item: item.Item ? item.Item.S : undefined,
			name: item.Name ? item.Name.S : undefined,
			completed: item.Completed ? item.Completed.BOOL : undefined,
			priority: item.Priority ? item.Priority.N : undefined,
			task: item.Task ? item.Task.S : undefined
		}
		results.push(currItem)
	})

	return NextResponse.json(results)
}

export async function POST(req: Request) {
	const data = await req.json()

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId') as string
	const item = searchParams.get('item')

	const { taskId, taskName, taskPriority, taskCompleted } = data
	if (!userId || !item) NextResponse.json({ message: 'Missing data!' })

	const Item = {
		UserID: { S: userId },
		Item: { S: `${item}#${taskId}` },
		Task: { S: taskName },
		Priority: { N: taskPriority },
		Completed: { BOOL: taskCompleted }
	}
	await client.send(
		new PutItemCommand({
			TableName: process.env.TABLE_NAME,
			Item
		})
	)

	return NextResponse.json({
		message: `Item ${taskId} successfully created!`
	})
}
