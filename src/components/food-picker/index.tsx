import './styles.scss'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { searchFoodItems as searchFoodItemsApiCall } from '../../api/food-service'
import { IFoodItem, Meal } from '../../types'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

interface IFoodPickerProps {
    onSelect: (item: IFoodItem) => void
    currentMeal: Meal
    onCurrentMealChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onAddMeal: () => void
}

const searchFoodItems = AwesomeDebouncePromise(searchFoodItemsApiCall, 300)

export const FoodPicker: React.FunctionComponent<IFoodPickerProps> = ({
    onSelect,
    currentMeal,
    onCurrentMealChange,
    onAddMeal
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [pristine, setPristine] = useState<boolean>(true)
    const [noResults, setNoResults] = useState<boolean>(false)
    const [foodSearchResults, setFoodSearchResults] = useState<IFoodItem[]>([])

    useEffect(() => {
        setFoodSearchResults([])
        if (!searchQuery) {
            return
        }
        setNoResults(false)
        setLoading(true)
        searchFoodItems(searchQuery)
            .then(({ data }) => {
                if (!data.length) {
                    setNoResults(true)
                }

                setFoodSearchResults(data)
                setLoading(false)
            })
            .catch((e) => console.log('err', e))
    }, [searchQuery])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        const isPristine = !query
        setNoResults(false)
        setSearchQuery(query)
        setPristine(isPristine)
    }

    const onItemSelect = (item: IFoodItem) => {
        setSearchQuery('')
        setPristine(true)
        setNoResults(false)
        onSelect(item)
    }

    return (
        <div className="food-picker">
            <div>
                <input
                    type="radio"
                    onChange={onCurrentMealChange}
                    value="breakfast"
                    checked={currentMeal === 'breakfast'}
                />
                <input
                    type="radio"
                    onChange={onCurrentMealChange}
                    value="lunch"
                    checked={currentMeal === 'lunch'}
                />
                <input
                    type="radio"
                    onChange={onCurrentMealChange}
                    value="dinner"
                    checked={currentMeal === 'dinner'}
                />
            </div>

            <button onClick={onAddMeal}>Add meal</button>

            <input className="food-picker__input" value={searchQuery} onChange={handleOnChange} />
            <ResultsBox
                pristine={pristine}
                loading={loading}
                onSelect={onItemSelect}
                results={foodSearchResults}
                noResults={noResults}
            />
        </div>
    )
}

interface IResultsBoxProps {
    loading: boolean
    results: IFoodItem[]
    noResults: boolean
    pristine: boolean
    onSelect: (item: IFoodItem) => void
}

const ResultsBox: React.FunctionComponent<IResultsBoxProps> = ({
    loading,
    results,
    onSelect,
    pristine,
    noResults
}) => {
    if (pristine) {
        return null
    }

    return (
        <div className="results-box">
            {loading && (
                <div className="results-box__spinner">
                    <div className="results-box__spinner__element" />
                </div>
            )}

            {noResults && (
                <div className="results-box__no-results">
                    Sorry, we can't find that item on our database.
                </div>
            )}

            {results.map((r) => (
                <div key={r.id} className="results-box__result" onClick={() => onSelect(r)}>
                    <div className="results-box__result__name">{r.name}</div>
                    <div>
                        <div className="results-box__result__portion">
                            {`Portion: ${r.portion}g`},
                        </div>
                        <div className="results-box__result__kcal">
                            {`${r.calories} kcal / 100g`}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
