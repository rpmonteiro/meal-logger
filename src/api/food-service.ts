import { IFoodItem } from '../types'
import { dummyFoodItems } from '../dummy-data'

export const searchFoodItems = (query: string): Promise<IFoodItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = dummyFoodItems.filter((i) => {
                return i.name
                    .toLowerCase()
                    .replace(' ', '')
                    .includes(query.toLowerCase())
            })

            resolve(results)
        }, 500)
    })
}
