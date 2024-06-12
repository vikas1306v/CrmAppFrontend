import React from 'react'
import { useSelector } from 'react-redux';

const List = ({user,campaign}) => {
  const userData = useSelector(state => state.user)
  const handleStartCampaign=async()=>{
    //call api
    const headers = {
      "Content-Type": "application/json"  ,
      "Authorization": "Bearer "+userData.token+""
  };
  const response = await fetch("http://localhost:9090/crmapp/communication/start-campaign/"+campaign.id, {
      method: "POST",
      headers: headers
  });
  }
  return (
    <>
     <div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
      <div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
        <img alt="IMG"></img>
      </div>
      <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
      {user && (
            <>
              <h2 className="text-gray-900 text-lg title-font font-medium mb-2">{user.name}</h2>
              <p className="leading-relaxed text-base">{user.email}</p>
            </>
          )}
          {campaign && (
            <>
              <h2 className="text-gray-900 text-lg title-font font-medium mb-2">Rule: {campaign.rule}</h2>
              <p className="leading-relaxed text-base">{campaign.startDate}</p>
              <p className="leading-relaxed text-base">Campaign Status{campaign.campaignOver?<h1>True</h1>:<h1>False</h1>}</p>
              <button onClick={handleStartCampaign}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ${campaign.campaignOver ? 'opacity-50 cursor-not-allowed' : ''}`} 
                disabled={campaign.campaignOver}
              >
                Start campaign
              </button>
            </>
          )}
       
      </div>
    </div>
    
    </>
  )
}

export default List