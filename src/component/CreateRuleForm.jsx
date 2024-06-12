import axios from 'axios';
import { set } from 'firebase/database';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const createNode = (id, field, condition, value, connector = null, prevId = null, nextId = null) => ({
  id,
  field,
  condition,
  value,
  connector,
  prevId,
  nextId,
});

const CreateRuleForm = () => {
  const userData=useSelector(state=>state.user)
  const [linkedList, setLinkedList] = useState([])
  const [wantConnector, setWantConnector] = useState(false)
  const [field, setField] = useState('totalSpends');
  const [condition, setCondition] = useState('>');
  const [value, setValue] = useState('5');
  const [connector, setConnector] = useState(null);
  const [audienceSize, setAudienceSize] = useState(0)
  const [isPreviousNodeHasConnector, setIsPreviousNodeHasConnector] = useState(true)

  const addNodeToLinkedList = () => {
    const newNodeId = linkedList.length;
    setIsPreviousNodeHasConnector(wantConnector ? true : false)
    const newNode = createNode(
      newNodeId,
      field,
      condition,
      value,
      wantConnector ? connector : null,
      newNodeId > 0 ? linkedList[linkedList.length - 1].id : null
    );

    if (newNodeId > 0) {
      const updatedLinkedList = linkedList.map((node, index) =>
        index === linkedList.length - 1 ? { ...node, nextId: newNodeId } : node
      );
      setLinkedList([...updatedLinkedList, newNode]);
    } else {
      setLinkedList([newNode]);
    }

    resetForm();
  };

  const handleAddRule = () => {
    if (linkedList.length > 0 && linkedList[linkedList.length - 1].connector === null) {
      alert("please add connector to previous rule to add this rule")
      return;
    }
    if (value === '' || field === ''||condition==='') {
      alert('Please fill all the fields')
      return;
    }
    addNodeToLinkedList()
  };
  const handleWantConnector = () => {
    if (linkedList.length > 0 && linkedList[linkedList.length - 1].connector === null) {
      alert("please add connector to previous rule to add this rule")
      return;
    }
    setWantConnector(true)
  }

  const hadnleAddCompleteRule = async () => {
    if (linkedList.length === 0) {
      alert('Please add atleast one query to save the rule')
      return;
    }
    
  
    try {
      const token =userData.token 
    
      console.log(linkedList)
    
      const response = await axios.post(
        'http://localhost:9090/crmapp/campaign/create-campaign',
        { rules: linkedList },
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          },
        }
      );
      if(response.data.status==false){
        alert(response.data.message)
      }
      if(response.data.data!=null){
        alert('Rule has been saved successfully')
      }
    
    } catch (error) {
      alert("server is not running")
    }
  
    resetForm2();

  }

  
  const checkAudienceSize = async () => {
   
    if (linkedList.length === 0) {
      alert('Please add atleast one query to save the rule')
      return;
    }
    try {
      const token =userData.token 
      
    
      const response = await axios.post(
        'http://localhost:9090/crmapp/campaign/get-audience-size',
        { rules: linkedList },
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
          },
        }
      );
      if(response.data.data!=null){
        document.getElementById('default-modal').classList.remove('hidden')
        setAudienceSize(response.data.data)
      }
    
    } catch (error) {
      alert("server is not running")
    }
    resetForm2();
  }
  const resetForm2 = () => {
    setField('');
    setCondition('');
    setValue('');
    setConnector('');
    setWantConnector(false);
    setIsPreviousNodeHasConnector(true)
    setLinkedList([])
  };
  const resetForm = () => {
    setField('');
    setCondition('');
    setValue('');
    setConnector('');
    setWantConnector(false);
  };

  return (
    <>{
      userData.token!=null?
      
      <div className="p-4 bg-white mt-10 shadow-md rounded-lg w-[70vw] mx-auto h-[80vh]"  >
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4 mt-5">
        <div className="flex-1  md:mb-0" >
          <label className="block text-gray-700 mb-2">Field</label>
          <select
            value={field}
            onChange={e => setField(e.target.value)}
            className="w-full p-2 border rounded">
            <option value="totalSpends">Total Spends</option>
            <option value="noOfSuccessfulLogins">Visits</option>
          </select>
        </div>
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-gray-700 mb-2">Condition</label>
          <select
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="w-full p-2 border rounded">
            <option value=">">{">"}</option>
            <option value="<">{"<"}</option>
          </select>
        </div>
        <div className="flex-1 mb-4 md:mb-0">
          <label className="block text-gray-700 mb-2">Value</label>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter value"
          />
        </div>
        {

          wantConnector ? <div className="flex-1 mb-4 md:mb-0">
            <label className="block text-gray-700 mb-2">Connector</label>
            <select
              value={connector}
              onChange={e => setConnector(e.target.value)}
              className="ml-2 p-2 border rounded">
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div> : null
        }
      </div>
      <div>
      {linkedList.map((node, index) => (
        <div key={index} className="inline-flex space-x-4 font-semibold">
    
          <p>{node.field}</p>
          <p>{node.condition}</p>
          <p>{node.value}</p>
          <p>{node.connector}</p>
        </div>
      ))}
    </div >
     <div className='flex'>
     {isPreviousNodeHasConnector ? <button type="button" className="mx-auto p-2 m-4 bg-blue-500 text-white rounded"
        onClick={handleWantConnector}>Want to add connector at the end Of this query</button> : null}
     </div>

     <div className='flex'>
     {isPreviousNodeHasConnector   ? 
        <button
          onClick={handleAddRule}
          className=" p-2 mx-auto bg-blue-500 text-white rounded">
          Add This Query
        </button>
        : null}
     </div>
    <div className='flex'>
      {linkedList.length > 0 ? <button type='button' className="mx-auto p-2 mt-3 bg-blue-500 text-white rounded"
        onClick={hadnleAddCompleteRule}>Add Complete Rule</button> : null}
        </div>
        <div>
          <div className='flex'>
        {linkedList.length > 0 ? <button type='button' className="mx-auto p-2 mt-3 bg-blue-500 text-white rounded"
        onClick={checkAudienceSize}>Find Audience Size</button> : null}
        </div>
        </div>
    </div>
    :<div className='flex flex-col'>
    <div className='mx-auto mt-16'>You are not authorized</div>
    <Link  className='mx-auto mt-5' to="/signin"> <button class="bg-blue-500 w-20  hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
        Login
    </button></Link>
</div>

    }
    <div id="default-modal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 backdrop-blur-sm">
  <div class="relative p-4 w-full max-w-2xl max-h-full">
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Audience Size
        </h3>
        <button onClick={() => {
          document.getElementById('default-modal').classList.add('hidden')
        }} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <div class="p-4 md:p-5 space-y-4">
        <p class=" leading-relaxed text-xl text-gray-500 dark:text-gray-400">
          With this rule you can target {audienceSize} Customers
        </p>
        
      </div>
    </div>
  </div>
</div>

    




    </>
  );
};

export default CreateRuleForm;
