import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import List from '../component/List'
import { Link } from 'react-router-dom'

const Campaign = () => {
    const userData = useSelector(state => state.user)
    const [campaignList, setCampaignList] = useState()
    const fetchAllCampaign = async () => {
        const headers = {
            "Content-Type": "application/json"  ,
            "Authorization": "Bearer "+userData.token+""
        };
        const response = await fetch("http://localhost:9090/crmapp/campaign/get-all-campaign", {
            method: "GET",
            headers: headers
        });
        const data=await response.json();
    
        setCampaignList(data.data)
    }

    useEffect(()=>{
        fetchAllCampaign();
    },[])
  return (
    <>
     <section class="text-gray-600 body-font">
                <div class="container px-5 py-24 mx-auto">
                    {
                        userData.token !== null&&campaignList!=null ? campaignList.map((campaign, index) => {
                            return <List campaign={campaign} key={index} />
                        }) : <div className='flex flex-col'>
                            <div className='mx-auto mt-10'>You are not authorized</div>
                            <Link  className='mx-auto mt-5' to="/signin"> <button class="bg-blue-500 w-20  hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                                Login
                            </button></Link>
                        </div>
                    }
                </div>
            </section>
    </>
  )
}

export default Campaign