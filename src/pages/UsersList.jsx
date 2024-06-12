import React, { useEffect, useState } from 'react'
import List from '../component/List'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { set } from 'firebase/database'

const UsersList = () => {
    const userData = useSelector(state => state.user)
    const [users, setUsers] = useState()
    const fetchAllUsers = async () => {
        const headers = {
            "Content-Type": "application/json"  
        };
        const response = await fetch("http://localhost:9090/crmapp/auth/get-all-customer", {
            method: "GET",
            headers: headers
        });
        const data=await response.json();
    
        setUsers(data.data)
    }

    useEffect(()=>{
        fetchAllUsers();
    },[])
   
    
    return (
        <>
            <section class="text-gray-600 body-font">
                <div class="container px-5 py-24 mx-auto">
                    {
                        userData.token !== null&&users!=null ? users.map((user, index) => {
                            return <List user={user} key={index} />
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

export default UsersList