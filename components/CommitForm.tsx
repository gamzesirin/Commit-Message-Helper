'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commitFormSchema, type CommitFormData, commitTypeEnum } from '@/lib/schemas/commit-form-schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PreviewBox } from '@/components/PreviewBox'
import { CopyButton } from '@/components/CopyButton'
import { generateCommitMessage } from '@/lib/generateCommitMessage'

export function CommitForm() {
	const {
		watch,
		setValue,
		formState: { errors, touchedFields }
	} = useForm<CommitFormData>({
		resolver: zodResolver(commitFormSchema),
		mode: 'onTouched',
		defaultValues: {
			type: undefined,
			scope: '',
			description: '',
			body: '',
			footer: ''
		},
		reValidateMode: 'onChange'
	})

	const formValues = watch()
	const commitMessage = generateCommitMessage(formValues)

	const isRequiredFieldsFilled = Boolean(formValues.type && formValues.description)

	const handleInputChange =
		(field: keyof CommitFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setValue(field, e.target.value, { shouldValidate: true })
		}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label className="flex items-center">
						Commit Türü
						<span className="text-red-500 ml-1">*</span>
					</Label>
					<Select
						onValueChange={(value) => setValue('type', value as CommitFormData['type'], { shouldValidate: true })}
					>
						<SelectTrigger className={touchedFields.type && !formValues.type ? 'border-red-500' : ''}>
							<SelectValue placeholder="Commit türü seçin" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(commitTypeEnum.enum).map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{touchedFields.type && !formValues.type && (
						<p className="text-sm text-red-500">Commit türü seçilmesi zorunludur</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="flex items-center">
						Kapsam (Opsiyonel)
					</Label>
					<Input
						value={formValues.scope || ''}
						onChange={handleInputChange('scope')}
						placeholder="Kapsam girin (örn: auth)"
						className="bg-white/50 dark:bg-neutral-900/50"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="flex items-center">
					Açıklama
					<span className="text-red-500 ml-1">*</span>
				</Label>
				<Input
					value={formValues.description || ''}
					onChange={handleInputChange('description')}
					placeholder="Açıklama girin"
					className={`bg-white/50 dark:bg-neutral-900/50 ${
						touchedFields.description && errors.description ? 'border-red-500' : ''
					}`}
				/>
				{touchedFields.description && errors.description && (
					<p className="text-sm text-red-500">{errors.description.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label>Detay (Opsiyonel)</Label>
				<Textarea
					value={formValues.body || ''}
					onChange={handleInputChange('body')}
					placeholder="Detaylı açıklama"
					rows={3}
					className="bg-white/50 dark:bg-neutral-900/50 resize-none"
				/>
			</div>

			<div className="space-y-2">
				<Label>Alt Bilgi (Opsiyonel)</Label>
				<Input
					value={formValues.footer || ''}
					onChange={handleInputChange('footer')}
					placeholder="Örn: Closes #123"
					className="bg-white/50 dark:bg-neutral-900/50"
				/>
			</div>

			<div className="space-y-2">
				<Label>Önizleme</Label>
				<PreviewBox message={commitMessage} />
			</div>

			<div className="flex justify-between items-center">
				<p className="text-sm text-muted-foreground">* ile işaretli alanlar zorunludur</p>
				<CopyButton text={commitMessage} disabled={!isRequiredFieldsFilled} />
			</div>
		</div>
	)
}
