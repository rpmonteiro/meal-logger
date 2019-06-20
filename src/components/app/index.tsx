/*

2. To speed things along, please prepare a basic site with the functionality described below, using your preferred mechanism, and have it ready before the interview begins (you can create a private Github project and add invite your Noom interviewer to it at the start of the call).
3. The application to prepare is a basic meal logger.
4. Users can add an arbitrary number of food items to each meal.
5. Food items are given in an array. Each item conforms to the following schema:
• {id: String, name: String, calories: int, portion: int}
• `calories` is number of calories per 100g.
• `portion` is size of a single portion in grams.
6. For each meal, calculate the total number of calories based on the number of portions logged for each food item.
7. We don’t care about the prototype looking good in a browser. We want to see how you organize your code, how you consider corner cases, and how aware you are of browser limitations.
8. During the interview you will add functionality to this meal logger. The interview lasts between 30 and 60 minutes.
*/

import React, { useState } from 'react'
import { FoodPicker } from '../food-picker'
import { FoodOverview } from '../food-overview'
import { ISelectedFoodItem, IFoodItem } from '../../types'
import './styles.scss'

export const App: React.FC = () => {
    const [selectedItems, setSelectedItems] = useState<ISelectedFoodItem[]>([])

    const onFoodSelect = (item: IFoodItem) => {
        const selectedItem: ISelectedFoodItem = {
            ...item,
            consumedPortion: item.portion
        }
        setSelectedItems([...selectedItems, selectedItem])
    }

    const onSelectedItemChange = (selectedItems: ISelectedFoodItem[]) => {
        setSelectedItems(selectedItems)
    }

    return (
        <div className="app">
            <div className="app__container">
                <div className="app__title">
                    <span>Ric's food logger</span>
                </div>

                <div className="app__content">
                    <FoodPicker onSelect={onFoodSelect} />

                    <div className="app__content__food-overview">
                        <FoodOverview
                            selectedItems={selectedItems}
                            changeHandler={onSelectedItemChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
