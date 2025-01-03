
const Header = () => {
    return (
        <div className=" flex flex-col justify-center items-center h-full
         p-5 w-full ">
        
   
            
            <div className="bg-blue-500 text-white p-4 w-9/12 rounded">
              
              <div className="h-24 w-24 bg-slate-50 m-auto rounded-full"><img src="/logo.png"/></div>
                <h2 className="flex text-xl  font-thin m-auto text-center pt-5 items-center content-center justify-center" >Upgrade to Kmail tools <strong className="font-black text-sm text-red-500 h-8 mx-2 items-center content-center w-8 rounded-full bg-slate-50">Pro</strong>!</h2>

                <p className="mb-5 justify-center w-full flex">Unlock more functionality and accomplish more tasks with our Pro version.</p>
                <a className=" m-auto flex duration-300 hover:bg-blue-700 hover:shadow mt-5 bg-blue-600 justify-center text-blue-50 px-4 py-2 shadow rounded w-1/5" href="https://kmail.at">More</a>
            </div>
        
        </div>
    );
    }

export default Header;