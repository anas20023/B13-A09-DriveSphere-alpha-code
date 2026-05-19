export const getCars = async () => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/cars`)
        if (!res.ok) {
            throw new Error('Failed to fetch cars');
        }
        return res.json()
    } catch (error) {
        console.log(error.message)
        return []
    }
}
export const getCarsByID = async (id) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/cars/${id}`)
        if (!res.ok) {
            throw new Error('Failed to fetch car');
        }
        return res.json()
    } catch (error) {
        console.log(error.message)
        return {}
    }
}