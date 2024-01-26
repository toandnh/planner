import { NextResponse } from 'next/server'

import {
	DynamoDBClient,
	QueryCommand,
	PutItemCommand,
	UpdateItemCommand,
	DeleteItemCommand
} from '@aws-sdk/client-dynamodb'

import type { AttributeValue } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

export async function GET(req: Request) {
	const item = 'todo'

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId')

	if (!userId || userId === null)
		return NextResponse.json({ message: 'Missing userID!' })

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
				'#i': 'Item'
			},
			ProjectionExpression: '#i, Completed, Priority, Task, TaskItems'
		})
	)

	if (!Items || Object.keys(Items).length <= 0) {
		return NextResponse.json({
			message: `Item '${item}' from user '${userId}' not found!`
		})
	}

	const results: TodoDatum[] = []
	Items.map((item) => {
		let taskItemsArr: (string | boolean)[][] = []
		if (item.TaskItems) {
			const keys = Object.keys(item.TaskItems.M as Object)
			keys.map((key: string) => {
				taskItemsArr.push([key, item.TaskItems.M![key].BOOL!])
			})
		}

		let currItem = {
			item: item.Item.S!,
			completed: item.Completed.BOOL!,
			priority: item.Priority.N!,
			task: item.Task.S!,
			taskItems: taskItemsArr
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

	const { item, task, taskItems, priority, completed } = data

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
				Item: { S: item as string },
				Task: { S: task as string },
				TaskItems: { M: taskItemsObj as Record<string, AttributeValue> },
				Priority: { N: `${priority}` as string },
				Completed: { BOOL: completed as boolean }
			}
		})
	)

	return NextResponse.json({
		message: `Item ${item} successfully created!`
	})
}

export async function PUT(req: Request) {
	const data = await req.json()

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId') as string

	if (!userId || userId === null)
		NextResponse.json({ message: 'Missing data!' })

	const { item, task, taskItems, priority, completed } = data

	let taskItemsObj: { [key: string]: { BOOL: boolean } } = {}
	if (taskItems) {
		// Each item in taskItems is in the form [string, boolean]
		taskItems.map((item: (string | boolean)[]) => {
			taskItemsObj[item[0] as string] = { BOOL: item[1] as boolean }
		})
	}

	const { Attributes } = await client.send(
		new UpdateItemCommand({
			TableName: process.env.TABLE_NAME,
			Key: {
				UserID: { S: userId },
				Item: { S: item }
			},
			UpdateExpression:
				'SET TaskItems = :ti, Task = :tn, Priority = :tp, Completed = :tc',
			ExpressionAttributeValues: {
				':tn': { S: task },
				':ti': { M: taskItemsObj },
				':tp': { N: priority },
				':tc': { BOOL: completed }
			},
			ReturnValues: 'ALL_NEW'
		})
	)

	return NextResponse.json(Attributes)
}

export async function DELETE(req: Request) {
	const data = await req.json()

	const searchParams = new URL(req.url as string).searchParams
	const userId = searchParams.get('userId') as string

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
