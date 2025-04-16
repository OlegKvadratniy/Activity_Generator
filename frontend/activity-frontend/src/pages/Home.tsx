import { useState, useEffect, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// Тип для активности
interface Activity {
	id: string
	description: string
	category: string
	durationMinutes: number
}

function Home() {
	const [activity, setActivity] = useState<Activity | null>(null)
	const [categories, setCategories] = useState<string[]>([])
	const [selectedCategory, setSelectedCategory] = useState<string>('')

	// Загружаем категории с бэкенда при монтировании компонента
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get<Activity[]>(
					'http://localhost:8080/api/activities'
				)
				const uniqueCategories = [
					...new Set(response.data.map(act => act.category)),
				]
				setCategories(uniqueCategories)
			} catch (error) {
				console.error('Error fetching categories:', error)
			}
		}
		fetchCategories()
	}, [])

	// Функция для получения случайной активности
	const fetchRandomActivity = async () => {
		try {
			const url = selectedCategory
				? `http://localhost:8080/api/activities/random?category=${selectedCategory}`
				: 'http://localhost:8080/api/activities/random'
			const response = await axios.get<Activity>(url)
			setActivity(response.data)
		} catch (error) {
			console.error('Error fetching activity:', error)
		}
	}

	// Обработчик изменения категории
	const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-0 w-full'>
			<div className='w-full space-y-10 text-center'>
				{/* Заголовок и описание */}
				<div className='animate-fade-in'>
					<h1 className='text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight px-2 sm:px-4'>
						Генератор "Что бы такого сделать?"
					</h1>
					<p className='mt-4 text-xl text-gray-600 px-2 sm:px-4'>
						Выберите категорию и найдите идею для вашего следующего занятия!
					</p>
				</div>

				{/* Выбор категории с анимацией появления сверху */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='mt-8 px-2 sm:px-4'
				>
					<div className='relative w-full'>
						<select
							value={selectedCategory}
							onChange={handleCategoryChange}
							className='appearance-none w-full bg-white border border-gray-300 rounded-lg py-4 px-5 pr-10 text-gray-700 text-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
						>
							<option value=''>Все категории</option>
							{categories.map(category => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
						<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700'>
							<svg
								className='h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</div>
					</div>
				</motion.div>

				{/* Кнопка "Сгенерировать" */}
				<div className='mt-8 animate-fade-in'>
					<button
						onClick={fetchRandomActivity}
						className='inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105'
					>
						<svg
							className='h-6 w-6 mr-3 text-white'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M12 4v1m0 14v1m8-8h-1m-14 0H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707'
							/>
						</svg>
						Сгенерировать
					</button>
				</div>

				{/* Карточка активности с анимацией ухода вниз и появления снизу */}
				<AnimatePresence mode='wait'>
					{activity && (
						<motion.div
							key={activity.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
							className='mt-10 px-2 sm:px-4'
						>
							<div className='bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 w-full'>
								<div className='flex items-center space-x-4'>
									<svg
										className='h-10 w-10 text-blue-500'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M5 13l4 4L19 7'
										/>
									</svg>
									<div className='w-full'>
										<h3 className='text-2xl font-semibold text-gray-900'>
											{activity.description}
										</h3>
										<p className='mt-2 text-base text-gray-600'>
											Категория:{' '}
											<span className='font-medium'>{activity.category}</span>
										</p>
										<p className='mt-1 text-base text-gray-600'>
											Время:{' '}
											<span className='font-medium'>
												{activity.durationMinutes} минут
											</span>
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Home
