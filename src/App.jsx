import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import SlideBar from './component/SlideBar'
import SignInPage from './pages/SignInPage'
import Campaign from './pages/Campaign'
import UsersList from './pages/UsersList'
import Home from './pages/Home'
import CreateRuleForm from './component/CreateRuleForm'
function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SlideBar/>} >
      <Route index element={<Home/>}/>
      <Route path='audience-builder' element={<CreateRuleForm/>} />
      <Route path="allcampaign" element={<Campaign/>} />
      <Route path="users" element={<UsersList/>} />
      <Route path="signin" element={<SignInPage/>} />
      </Route>

    </Routes>
    </BrowserRouter>
    
      {/* <AudienceBuilder /> */}
    </>
  )
}

export default App
