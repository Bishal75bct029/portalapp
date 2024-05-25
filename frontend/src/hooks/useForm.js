import { useState } from 'react'

export default function useForm(initial) {
    const [data, setData] = useState(initial)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    return {
        data,
        setData,
        updateData: (key, value) => {
            setData({
                ...data,
                [key]: value
            })
        },
        reset: () => {
            setLoading(false)
            setErrors({})
            setData(initial)
        },
        loading,
        setLoading,
        errors,
        setErrors,
    }
}