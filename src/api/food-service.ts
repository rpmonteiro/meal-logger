import { IFoodItem } from '../types'
import axios, { AxiosPromise } from 'axios'

export const searchFoodItems = (query: string): AxiosPromise<IFoodItem[]> => {
    return axios.get(
        `https://68xqa2jxzh.execute-api.us-east-1.amazonaws.com/dev/search?kv=${encodeURI(query)}`
    )

    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         const results = dummyFoodItems.filter((i) => {
    //             return i.name
    //                 .toLowerCase()
    //                 .replace(' ', '')
    //                 .includes(query.toLowerCase())
    //         })

    //         resolve(results)
    //     }, 500)
    // })
}
