export function createSlug(text: string) {
	return text
		.normalize('NFC')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\w\s]/gi, '')
		.trim()
		.replace(/\s+/g, '-')
		.toLowerCase()
}
