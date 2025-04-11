import * as z from 'zod'

export const commitTypeEnum = z.enum([
	'feat',
	'fix',
	'docs',
	'style',
	'refactor',
	'perf',
	'test',
	'build',
	'ci',
	'chore',
	'revert'
])

export const commitFormSchema = z.object({
	type: commitTypeEnum.describe('Commit Türü'),
	scope: z.string().optional(),
	description: z.string().min(1, 'Açıklama alanı zorunludur').max(100, 'Açıklama çok uzun'),
	body: z.string().optional(),
	footer: z.string().optional()
})

export type CommitFormData = z.infer<typeof commitFormSchema>
