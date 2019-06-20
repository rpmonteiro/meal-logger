import './styles.scss'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { searchFoodItems as searchFoodItemsApiCall } from '../../api/food-service'
import { IFoodItem } from '../../types'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

interface IFoodPickerProps {
    onSelect: (item: IFoodItem) => void
}

const searchFoodItems = AwesomeDebouncePromise(searchFoodItemsApiCall, 300)

export const FoodPicker: React.FunctionComponent<IFoodPickerProps> = ({ onSelect }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [pristine, setPristine] = useState<boolean>(true)
    const [foodSearchResults, setFoodSearchResults] = useState<IFoodItem[]>([])

    useEffect(() => {
        setFoodSearchResults([])
        if (!searchQuery) {
            return
        }
        setLoading(true)
        searchFoodItems(searchQuery)
            .then((res) => {
                setFoodSearchResults(res)
                setLoading(false)
            })
            .catch((e) => console.log('err', e))
    }, [searchQuery])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        const isPristine = !query
        setSearchQuery(query)
        setPristine(isPristine)
    }

    const onItemSelect = (item: IFoodItem) => {
        setSearchQuery('')
        setPristine(true)
        onSelect(item)
    }

    return (
        <div className="food-picker">
            <input className="food-picker__input" value={searchQuery} onChange={handleOnChange} />
            <ResultsBox
                pristine={pristine}
                loading={loading}
                onSelect={onItemSelect}
                results={foodSearchResults}
            />
        </div>
    )
}

interface IResultsBoxProps {
    loading: boolean
    results: IFoodItem[]
    pristine: boolean
    onSelect: (item: IFoodItem) => void
}

const ResultsBox: React.FunctionComponent<IResultsBoxProps> = ({
    loading,
    results,
    onSelect,
    pristine
}) => {
    if (pristine) {
        return null
    }

    return (
        <div className="results-box">
            {loading && <div className="results-box__spinner" />}
            {results.map((r) => (
                <div key={r.id} className="results-box__result" onClick={() => onSelect(r)}>
                    <div className="results-box__result__name">{r.name}</div>
                    <div>
                        <div className="results-box__result__portion">
                            {`Portion: ${r.portion}g`},
                        </div>
                        <div className="results-box__result__kcal">
                            {`${r.calories} calories / 100g`}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
