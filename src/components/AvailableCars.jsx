import { getCars } from '@/utils/utils'
import React from 'react'

const AvailableCars = async () => {
    const res = await getCars()
    return (
        <div>
            Available Cars
        </div>
    )
}

export default AvailableCars
