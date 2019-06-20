import { ISelectedFoodItem, Meal, IMeal } from '../../types'
import React, { ReactNode } from 'react'
import './styles.scss'

interface IFoodOverviewProps {
    currentMeal: Meal
    currentMealIdx: number
    meals: IMeal
    changeHandler: (selectedItems: ISelectedFoodItem[], meal: Meal, mealIdx: number) => void
}

const isNotANumber = (val: string) => {
    return Number.isNaN(Number(val))
}

const totalCaloriesInMeal = (items: ISelectedFoodItem[]): number => {
    return items.reduce((acc, i) => {
        // still show total calories if user cleared input (thus leading to NaN)
        return i.consumedPortion ? acc + (i.consumedPortion / i.portion) * i.calories : acc
    }, 0)
}

export const FoodOverview: React.FunctionComponent<IFoodOverviewProps> = ({
    meals,
    changeHandler
}) => {
    const onChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        itemIdx: number,
        meal: Meal,
        mealIdx: number
    ) => {
        const val = e.target.value
        // ignore leading zeros and characters
        if (val && isNotANumber(val)) {
            return
        }

        const newSelectedItems = Array.from(meals[meal][mealIdx])
        newSelectedItems[itemIdx].consumedPortion = parseInt(e.target.value)
        changeHandler(newSelectedItems, meal, mealIdx)
    }

    const onDelete = (itemIdx: number, meal: Meal, mealIdx: number) => {
        const newSelectedItems = Array.from(meals[meal][mealIdx])
        newSelectedItems.splice(itemIdx, 1)
        changeHandler(newSelectedItems, meal, mealIdx)
    }

    let totalCalories = 0
    // @ts-ignore:next-line
    Object.keys(meals).forEach((mealType: Meal) => {
        const mealsOfType: ISelectedFoodItem[][] = meals[mealType]
        mealsOfType.forEach((meal) => {
            totalCalories += totalCaloriesInMeal(meal)
        })
    })

    // @ts-ignore:next-line
    const showTotalCalories = Object.keys(meals).some((k) => meals[k].length > 0)

    const renderSelectedItems = (
        items: ISelectedFoodItem[],
        meal: Meal,
        mealIdx: number
    ): ReactNode => {
        return items.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="food-overview__row">
                <div
                    className="food-overview__row__delete"
                    onClick={() => onDelete(idx, meal, mealIdx)}
                >
                    X
                </div>
                <div>{item.name}</div>
                <input
                    value={item.consumedPortion || ''}
                    type="text"
                    maxLength={4}
                    onChange={(e) => onChange(e, idx, meal, mealIdx)}
                />
                <span>g</span>
            </div>
        ))
    }

    const renderGroup = (
        mealGroupName: string,
        selectedItems: ISelectedFoodItem[],
        meal: Meal,
        mealIdx: number
    ): ReactNode => {
        return (
            <div>
                <div>{mealGroupName}</div>
                {renderSelectedItems(selectedItems, meal, mealIdx)}
            </div>
        )
    }

    return (
        <section className="food-overview">
            {Object.keys(meals).map((k) => {
                // @ts-ignore:next-line
                const mealGroup: ISelectedFoodItem[][] = meals[k]
                // @ts-ignore:next-line
                return mealGroup.map((i, idx) => renderGroup(k, meals[k][idx], k, idx))
            })}

            {showTotalCalories && (
                <div className="food-overview__calories">
                    <span className="food-overview__calories__label">Total calories: </span>
                    <span>{` ${totalCalories} kcal`}</span>
                </div>
            )}
        </section>
    )
}
