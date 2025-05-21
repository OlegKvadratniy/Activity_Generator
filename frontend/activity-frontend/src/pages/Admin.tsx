import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import axios from 'axios'

interface Activity {
	id: string
	description: string
	category: string
	durationMinutes: number
}

function Admin() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const [activities, setActivities] = useState<Activity[]>([])
	const [newActivity, setNewActivity] = useState({
		description: '',
		category: '',
		durationMinutes: '',
	})
	const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
	const [bulkActivities, setBulkActivities] = useState('')
	const [bulkCategory, setBulkCategory] = useState('')
	const [bulkDuration, setBulkDuration] = useState('')

	const handleLogin = (e: FormEvent) => {
		e.preventDefault()
		if (password === 'admin123') {
			setIsAuthenticated(true)
		} else {
			alert('Неверный пароль')
		}
	}

	const fetchActivities = async () => {
		try {
			const response = await axios.get<Activity[]>(
				'http://localhost:8081/api/activities'
			)
			setActivities(response.data)
		} catch (error) {
			console.error('Error fetching activities:', error)
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			fetchActivities()
		}
	}, [isAuthenticated])

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setNewActivity({ ...newActivity, [name]: value })
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		try {
			const response = await axios.post(
				'http://localhost:8081/api/activities',
				{
					...newActivity,
					durationMinutes: parseInt(newActivity.durationMinutes),
				}
			)
			console.log('Активность добавлена:', response.data)
			setNewActivity({ description: '', category: '', durationMinutes: '' })
			fetchActivities()
		} catch (error) {
			console.error('Error adding activity:', error)
		}
	}

	const handleEdit = (activity: Activity) => {
		setEditingActivity(activity)
		setNewActivity({
			description: activity.description,
			category: activity.category,
			durationMinutes: activity.durationMinutes.toString(),
		})
	}

	const handleUpdate = async (e: FormEvent) => {
		e.preventDefault()
		if (!editingActivity) return
		try {
			const response = await axios.put(
				`http://localhost:8081/api/activities/${editingActivity.id}`,
				{
					...newActivity,
					durationMinutes: parseInt(newActivity.durationMinutes),
				}
			)
			console.log('Активность обновлена:', response.data)
			setEditingActivity(null)
			setNewActivity({ description: '', category: '', durationMinutes: '' })
			fetchActivities()
		} catch (error) {
			console.error('Error updating activity:', error)
		}
	}

	const handleDelete = async (id: string) => {
		try {
			const response = await axios.delete(
				`http://localhost:8081/api/activities/${id}`
			)
			console.log('Активность удалена:', response.data)
			fetchActivities()
		} catch (error) {
			console.error('Error deleting activity:', error)
		}
	}

	const handleBulkSubmit = async (e: FormEvent) => {
		e.preventDefault()
		const descriptions = bulkActivities
			.split(',')
			.map(desc => desc.trim())
			.filter(desc => desc)
		if (descriptions.length === 0) return

		try {
			const promises = descriptions.map(desc =>
				axios.post('http://localhost:8081/api/activities', {
					description: desc,
					category: bulkCategory,
					durationMinutes: parseInt(bulkDuration),
				})
			)
			const responses = await Promise.all(promises)
			console.log('Массовое добавление завершено:', responses)
			setBulkActivities('')
			setBulkCategory('')
			setBulkDuration('')
			fetchActivities()
		} catch (error) {
			console.error('Error adding bulk activities:', error)
		}
	}

	if (!isAuthenticated) {
		return (
			<div className='min-h-screen bg-gray-50 py-12 px-0 w-full'>
				<div className='w-full space-y-8'>
					<div>
						<h1 className='text-center text-3xl font-bold text-gray-900'>
							Вход в админку
						</h1>
					</div>
					<form
						onSubmit={handleLogin}
						className='mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg px-2 sm:px-4'
					>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div className='relative'>
								<label htmlFor='password' className='sr-only'>
									Пароль
								</label>
								<span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
									<svg
										className='h-5 w-5'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 11c0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.38 1 1.73V15a1 1 0 001 1h2a1 1 0 001-1v-2.27c.6-.35 1-.99 1-1.73zm8-1h-1V8a6 6 0 00-12 0v2H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2z'
										/>
									</svg>
								</span>
								<input
									type='password'
									id='password'
									value={password}
									onChange={e => setPassword(e.target.value)}
									className='appearance-none rounded-lg relative block w-full pl-10 p-3 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-200 bg-white'
									placeholder='Введите пароль'
								/>
							</div>
						</div>
						<div>
							<button
								type='submit'
								className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200'
							>
								Войти
							</button>
						</div>
					</form>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-10 px-0 w-full'>
			<div className='w-full'>
				<h1 className='text-4xl font-bold text-gray-800 mb-8 text-center'>
					Админка: Управление активностями
				</h1>

				<div className='mb-8 bg-white p-6 rounded-lg shadow-lg w-full px-2 sm:px-4'>
					<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
						Множественное добавление
					</h2>
					<form onSubmit={handleBulkSubmit}>
						<div className='mb-4'>
							<label className='block text-sm font-semibold text-gray-700 mb-2'>
								Описания (через запятую)
							</label>
							<textarea
								value={bulkActivities}
								onChange={e => setBulkActivities(e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-lg bg-white text-black'
								placeholder='Введите описания, разделённые запятыми'
								rows={3}
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-semibold text-gray-700 mb-2'>
								Категория
							</label>
							<input
								type='text'
								value={bulkCategory}
								onChange={e => setBulkCategory(e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-lg bg-white text-black'
								placeholder='Введите категорию'
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-semibold text-gray-700 mb-2'>
								Время (минуты)
							</label>
							<input
								type='number'
								value={bulkDuration}
								onChange={e => setBulkDuration(e.target.value)}
								className='w-full p-3 border border-gray-300 rounded-lg bg-white text-black'
								placeholder='Введите время'
							/>
						</div>
						<button
							type='submit'
							className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold'
						>
							Добавить все
						</button>
					</form>
				</div>

				<form
					onSubmit={editingActivity ? handleUpdate : handleSubmit}
					className='mb-8 bg-white p-6 rounded-lg shadow-lg w-full px-2 sm:px-4'
				>
					<div className='mb-6'>
						<label
							className='block text-sm font-semibold text-gray-700 mb-2'
							htmlFor='description'
						>
							Описание
						</label>
						<div className='relative'>
							<span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
								<svg
									className='h-5 w-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M12 4v16m8-8H4'
									/>
								</svg>
							</span>
							<input
								type='text'
								name='description'
								id='description'
								value={newActivity.description}
								onChange={handleInputChange}
								className='w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-black'
								placeholder='Введите описание активности'
								required
							/>
						</div>
					</div>
					<div className='mb-6'>
						<label
							className='block text-sm font-semibold text-gray-700 mb-2'
							htmlFor='category'
						>
							Категория
						</label>
						<div className='relative'>
							<span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
								<svg
									className='h-5 w-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v4'
									/>
								</svg>
							</span>
							<input
								type='text'
								name='category'
								id='category'
								value={newActivity.category}
								onChange={handleInputChange}
								className='w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-black'
								placeholder='Введите категорию (например, fun)'
								required
							/>
						</div>
					</div>
					<div className='mb-6'>
						<label
							className='block text-sm font-semibold text-gray-700 mb-2'
							htmlFor='durationMinutes'
						>
							Время (минуты)
						</label>
						<div className='relative'>
							<span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500'>
								<svg
									className='h-5 w-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</span>
							<input
								type='number'
								name='durationMinutes'
								id='durationMinutes'
								value={newActivity.durationMinutes}
								onChange={handleInputChange}
								className='w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-black'
								placeholder='Введите время в минутах'
								required
							/>
						</div>
					</div>
					<div className='flex space-x-3 justify-center'>
						<button
							type='submit'
							className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold'
						>
							{editingActivity ? 'Обновить активность' : 'Добавить активность'}
						</button>
						{editingActivity && (
							<button
								type='button'
								onClick={() => {
									setEditingActivity(null)
									setNewActivity({
										description: '',
										category: '',
										durationMinutes: '',
									})
								}}
								className='bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200 font-semibold'
							>
								Отмена
							</button>
						)}
					</div>
				</form>

				<h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
					Список активностей
				</h2>
				<div className='grid gap-6 w-full px-2 sm:px-4'>
					{activities.map(activity => (
						<div
							key={activity.id}
							className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex flex-col sm:flex-row justify-between items-center'
						>
							<div className='mb-4 sm:mb-0'>
								<p className='text-lg font-semibold text-gray-800'>
									{activity.description}
								</p>
								<p className='text-sm text-gray-600'>
									Категория:{' '}
									<span className='font-medium'>{activity.category}</span>
								</p>
								<p className='text-sm text-gray-600'>
									Время:{' '}
									<span className='font-medium'>
										{activity.durationMinutes} минут
									</span>
								</p>
							</div>
							<div className='flex space-x-3'>
								<button
									onClick={() => handleEdit(activity)}
									className='bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 font-semibold'
								>
									Редактировать
								</button>
								<button
									onClick={() => handleDelete(activity.id)}
									className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 font-semibold'
								>
									Удалить
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Admin
