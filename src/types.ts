export interface IFoodItem {
    id: string
    name: string
    calories: number
    portion: number
}

export interface ISelectedFoodItem extends IFoodItem {
    consumedPortion: number
}
