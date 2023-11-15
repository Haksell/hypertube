import React from 'react'

type Prop = {
	disabled?: boolean
	text: string
	stylePerso?: string
	type?: 'button' | 'submit' | 'reset'
	onClick?: (event: React.FormEvent) => void
}

function Button({ disabled = false, text, stylePerso, type, onClick }: Prop) {
	let styleButton = `flex items-center justify-center px-3 mb:px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 w-auto  bg-gray-900 text-gray-200 border-gray-700 ${
		disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-500'
	}`
	if (stylePerso) styleButton = stylePerso
	return (
		<button disabled={disabled} onClick={onClick} type={type} className={styleButton}>
			<span>{text}</span>
		</button>
	)
}

export default Button
