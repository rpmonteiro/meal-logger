export interface IFoodItem {
    id: string
    name: string
    calories: number
    portion: number
}

export interface ISelectedFoodItem extends IFoodItem {
    consumedPortion: number
}

export type Meal = 'breakfast' | 'lunch' | 'dinner'

export interface IMeal {
    breakfast: ISelectedFoodItem[][]
    lunch: ISelectedFoodItem[][]
    dinner: ISelectedFoodItem[][]
}
