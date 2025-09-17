import { useNavigate } from "react-router-dom";
import arrow from '../../src/images/arrow.svg'

const BreadCrumb = ({page}) => {
    const navigate = useNavigate();
    const handleBack = ()=>{
        window.history.back();
    }

  return(
    <>
      <div className=''>
        <div className='py-4 px-6 w-full z-[1000]'>
          <div className='flex justify-between items-center mx-5'>
            <img onClick={handleBack} src={arrow} className="hover:cursor-pointer w-[20px] " /> 
              <div className="flex gap-3 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="16px" height="16px" viewBox="0 0 24 24" onClick={()=>navigate('/start')}><g fill="none" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M5 21h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M5 21v-13M19 21v-13"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="14;0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M2 10l10 -8l10 8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.6s" values="28;0"/></path></g></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 20 20"><path fill="#333333" fill-rule="evenodd" d="m7.053 2.158l7.243 7.256a.66.66 0 0 1 .204.483a.7.7 0 0 1-.204.497q-3.93 3.834-7.575 7.401c-.125.117-.625.408-1.011-.024c-.386-.433-.152-.81 0-.966l7.068-6.908l-6.747-6.759q-.369-.509.06-.939q.43-.43.962-.04"/></svg>
                <span className="text-[14px]">{page}</span>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BreadCrumb
