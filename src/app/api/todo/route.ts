import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	PutItemCommand
} from '@aws-sdk/client-dynamodb'

import type { AttributeValue } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

declare type QueryResults = {
	item: string | undefined
	name: string | undefined
	completed: boolean | undefined
	priority: string | undefined
	task: string | undefined
}

export async function GET(req: NextApiRequest) {
	const item = 'todo'

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')

	if (!userId) return NextResponse.json({ message: 'Missing data!' })

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
			ProjectionExpression: '#i, #n, Completed, Priority, Task, TaskItems'
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
			task: item.Task ? item.Task.S : undefined,
			taskItems: item.TaskItems ? item.TaskItems.M : undefined
		}
		results.push(currItem)
	})

	return NextResponse.json(results)
}

export async function POST(req: Request) {
	const data = await req.json()

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')

	if (!userId) NextResponse.json({ message: 'Missing data!' })

	const { taskId, taskName, taskItems, taskPriority, taskCompleted } = data

	let taskItemsObj: { [key: string]: { BOOL: boolean } } = {}
	// Each item in taskItems is in the form [string, boolean]
	taskItems.map((item: (string | boolean)[]) => {
		taskItemsObj[item[0] as string] = { BOOL: item[1] as boolean }
	})

	await client.send(
		new PutItemCommand({
			TableName: process.env.TABLE_NAME,
			Item: {
				UserID: { S: userId as string },
				Item: { S: taskId as string },
				Task: { S: taskName as string },
				TaskItems: { M: taskItemsObj as Record<string, AttributeValue> },
				Priority: { N: `${taskPriority}` as string },
				Completed: { BOOL: taskCompleted as boolean }
			}
		})
	)

	return NextResponse.json({
		message: `Item ${taskId} successfully created!`
	})
}
