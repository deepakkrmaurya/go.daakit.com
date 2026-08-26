import { configureStore }  from "@reduxjs/toolkit";
import TechbasedSlice from './TechbasedAuthSlice'

const store = configureStore({
    reducer : {
        techbased : TechbasedSlice
    }
})

export default store