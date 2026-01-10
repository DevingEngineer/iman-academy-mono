export type IncludedItemType = {
	label: string
}

export type PricingPlansType = {
	title: string
	description: string
	includedItems: IncludedItemType[]
	additionalItems: IncludedItemType[]
	additionalDescription: string
	price: string
	popular: boolean
}
