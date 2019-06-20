import { ISelectedFoodItem } from '../../types'
import React from 'react'
import './styles.scss'

interface IFoodOverviewProps {
    selectedItems: ISelectedFoodItem[]
    changeHandler: (selectedItems: ISelectedFoodItem[]) => void
}

const isNotANumber = (val: string) => {
    return Number.isNaN(Number(val))
}

export const FoodOverview: React.FunctionComponent<IFoodOverviewProps> = ({
    selectedItems,
    changeHandler
}) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value
        // ignore leading zeros and characters
        if (val && isNotANumber(val)) {
            return
        }

        const newSelectedItems = Array.from(selectedItems)
        newSelectedItems[idx].consumedPortion = parseInt(e.target.value)
        changeHandler(newSelectedItems)
    }

    const totalCalories =
        Math.round(
            selectedItems.reduce((acc, i) => {
                // still show total calories if user cleared input (thus leading to NaN)
                return i.consumedPortion ? acc + (i.consumedPortion / i.portion) * i.calories : acc
            }, 0)
        ) || 0

    return (
        <section className="food-overview">
            {selectedItems.map((item, idx) => {
                return (
                    <div key={item.name} className="food-overview__row">
                        <div>{item.name}</div>
                        <input
                            value={item.consumedPortion || ''}
                            type="text"
                            maxLength={4}
                            onChange={(e) => onChange(e, idx)}
                        />
                    </div>
                )
            })}

            <div>{`Total calories: ${totalCalories} kcal`}</div>
        </section>
    )
}
