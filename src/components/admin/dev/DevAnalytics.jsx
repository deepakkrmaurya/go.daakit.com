import React, { useEffect } from 'react'
import AxiosInstance from '@/Helper/axiosInstance'
import axios from 'axios';

function DevAnalytics() {
    const getDevAnalytics = async()=>{
        try {
            const response = await axios.get(`https://go-admin.daakit.com/api/admin/apiAnalytics`,
                            {
                                params: { date: "2026-09-30" },
                                withCredentials: true,
                            }
                            );
             console.log(response)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
     getDevAnalytics()
    },[])
  return (
    <div>DevAnalytics</div>
  )
}

export default DevAnalytics