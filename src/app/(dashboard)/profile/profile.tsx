'use client'

import { useEffect, useMemo, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

import clsx from 'clsx'

import { useMediaQuery } from '@/hooks/hooks'

export default function Profile({ data }: { data: HealthData }) {
	const fetcher = async (url: string, { arg }: { arg: HealthData }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/health', fetcher, {
		revalidate: true
	})

	const [gender, setGender] = useState(data.gender)
	const [birthYear, setBirthYear] = useState(data.birthYear)
	const [height, setHeight] = useState(data.height)
	const [weight, setWeight] = useState(data.weight)
	const [goal, setGoal] = useState(data.goal)
	const [activity, setActivity] = useState(data.activity)

	const [canSave, setCanSave] = useState(false)

	const isFirstBreakPoint = useMediaQuery(962)
	const isSecondBreakPoint = useMediaQuery(520)

	const bmi = useMemo(() => {
		// weight in kg
		let weight = parseInt(data.weight)
		// height in m
		let height = parseInt(data.height) / 100
		return Math.round(weight / (height * height))
	}, [data])

	useEffect(() => {
		const genderChange = gender !== data.gender
		const birthYearChange = birthYear !== data.birthYear
		const heightChange = height !== data.height && height !== ''
		const weightChange = weight !== data.weight && weight !== ''
		const goalChange = goal !== data.goal
		const activityChange = activity !== data.activity && activity !== ''

		const canUpdate =
			genderChange ||
			birthYearChange ||
			heightChange ||
			weightChange ||
			goalChange ||
			activityChange

		setCanSave(canUpdate)
	}, [gender, birthYear, height, weight, goal, activity])

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGender(e.target.options[e.target.selectedIndex].text)
	}

	const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBirthYear(e.target.value)
	}

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHeight(e.target.value)
	}

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWeight(e.target.value)
	}

	const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGoal(e.target.options[e.target.selectedIndex].text)
	}

	const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setActivity(e.target.options[e.target.selectedIndex].text)
	}

	const handleSubmit = async () => {
		await trigger({
			item: 'health',
			gender,
			birthYear,
			height,
			weight,
			goal,
			activity
		})

		// Revalidate all data from 'api/health...'
		mutate((key) => typeof key === 'string' && key.startsWith('/api/health'))

		setCanSave(false)
	}

	const breakPointView = (
		<div className='flex gap-5'>
			<div className='grid grid-flow-row gap-5'>
				<label>Gender: </label>
				<label>Height: </label>
				<label>Goal: </label>
				<label>Birthyear: </label>
				<label>Weight: </label>
				<label>Activity Level: </label>
			</div>

			<div
				className={clsx(
					'grid grid-flow-row gap-5',
					isSecondBreakPoint ? 'w-1/2' : ''
				)}
			>
				<select
					className='w-full'
					value={gender}
					onChange={handleGenderChange}
					name='gender'
				>
					<option value='female'>Female</option>
					<option value='male'>Male</option>
				</select>
				<input
					className='w-full'
					type='text'
					value={height}
					onChange={handleHeightChange}
				/>
				<select
					className='w-full'
					value={goal}
					onChange={handleGoalChange}
					name='options'
				>
					<option value='lose'>Lose</option>
					<option value='maintain'>Maintain</option>
					<option value='gain'>Gain</option>
				</select>
				<input
					className='w-full'
					type='text'
					value={birthYear}
					onChange={handleBirthYearChange}
				/>
				<input
					className='w-full'
					type='text'
					value={weight}
					onChange={handleWeightChange}
				/>
				<select
					className='w-full'
					value={activity}
					onChange={handleActivityChange}
					name='options'
				>
					<option value='Sedentary'>Sedentary</option>
					<option value='Lightly Active'>Lightly Active</option>
					<option value='Moderately Active'>Moderately Active</option>
					<option value='Active'>Active</option>
					<option value='Very Active'>Very Active</option>
				</select>
			</div>
		</div>
	)

	const otherView = (
		<div className='flex justify-center gap-5'>
			<div className='flex gap-5'>
				<div className='grid grid-flow-row gap-5'>
					<label>Gender: </label>
					<label>Height: </label>
					<label>Goal: </label>
				</div>

				<div className='grid grid-flow-row gap-5'>
					<select value={gender} onChange={handleGenderChange} name='gender'>
						<option value='female'>Female</option>
						<option value='male'>Male</option>
					</select>
					<input type='text' value={height} onChange={handleHeightChange} />
					<select value={goal} onChange={handleGoalChange} name='options'>
						<option value='lose'>Lose</option>
						<option value='maintain'>Maintain</option>
						<option value='gain'>Gain</option>
					</select>
				</div>
			</div>

			<div className='flex gap-5'>
				<div className='grid grid-flow-row gap-5'>
					<label>Birthyear: </label>
					<label>Weight: </label>
					<label>Activity Level: </label>
				</div>

				<div className='grid grid-flow-row gap-5'>
					<input
						type='text'
						value={birthYear}
						onChange={handleBirthYearChange}
					/>
					<input type='text' value={weight} onChange={handleWeightChange} />
					<select
						value={activity}
						onChange={handleActivityChange}
						name='options'
					>
						<option value='Sedentary'>Sedentary</option>
						<option value='Lightly Active'>Lightly Active</option>
						<option value='Moderately Active'>Moderately Active</option>
						<option value='Active'>Active</option>
						<option value='Very Active'>Very Active</option>
					</select>
				</div>
			</div>
		</div>
	)

	return (
		<div className='min-h-[60vh] flex flex-col justify-center items-center gap-10 p-5 border-2 rounded-md'>
			{isFirstBreakPoint ? breakPointView : otherView}

			<div>BMI: {bmi}</div>

			<div className='flex justify-center items-center'>
				<input
					className='w-full bg-green-300 flex items-end justify-center p-5 rounded-md hover:bg-green-400 hover:cursor-pointer hover:disabled:bg-green-200 hover:disabled:cursor-default disabled:bg-green-200'
					type='submit'
					value='Save changes'
					onClick={handleSubmit}
					disabled={!canSave}
				/>
			</div>
		</div>
	)
}
