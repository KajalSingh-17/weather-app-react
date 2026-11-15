import React from "react";
import { useState } from "react";

const App = () => {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const fetchWeather = async(val) =>{

     setLoading(true);
       setError(null);

    try{
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiUrl}&q=${val}`)
 
       if(!response.ok){
        throw new Error("Bad response");
       }
    const result = await response.json();
    setWeatherData({
      name:`${result.location.name},${result.location.region},${result.location.country}`,
      temp:`${result.current.temp_c} °C`,
      condition:`${result.current.condition.text}`,
      humidity:`${result.current.humidity}%`,
      windspeed:`${result.current.wind_kph} KM/H`,
      icon:`${result.current.condition.icon}`,
      time:`${result.location.localtime}`           
    })
    }catch(err){
         setError(err.message)
    }finally{
      setLoading(false)
    }
    
  }

  const handleSearch = (e) =>{
    e.preventDefault()
    if(!cityInput.trim()){
      return
    }else{
      fetchWeather(cityInput)
    }
  }

  const handleSearchGeo = () =>{
    if(!navigator.geolocation){
      setError("Geolocation is not supported by your browser.")
      return;
    }
    
    navigator.geolocation.getCurrentPosition((poisition) =>{
      const{latitude, longitude} = poisition.coords
      const cordinateString = `${latitude},${longitude}`

      fetchWeather(cordinateString)
    },
  (err)=>{
    setError(err.code === 1 ? ` Location permission denied` : `Unable to fetch location`)
  })
 
  }

  const exit = () =>{
    setWeatherData(null)
    setCityInput("")
    setError(null)
  }

  return (
    <div className="bg-black min-h-screen font-pixel ">
      <div className="flex justify-center items-center min-h-screen">
        <div className=" h-90 w-120 bg-gray-300  border-white border-1 flex flex-col justify-center items-center">
          <div className="h-9 w-113 bg-[#131C57] flex justify-between px-2 items-center border-gray-400 border ">
            <p className="text-white  ">Weather Forecast</p>
          </div>

        
{
  loading ? (
     <div className="h-73 w-113 bg-white flex flex-col justify-center items-center  border mt-2 border-2">
    <div>Loading...</div>
    </div>
  ) : error ? (
     <div className=" h-73 w-113 bg-white flex flex-col justify-center items-center  border mt-2 border-2">
    <div>Error occurred</div>
    </div>
  ) : !weatherData ? (
     <div className=" h-73 w-113 bg-white flex flex-col justify-center items-center  border mt-2 border-2">
    <div className="flex items-center flex-col">
              <h2 className="mb-10 text-2xl flex justify-center font-semibold">Find Your City!</h2>
            
            <div className="shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]  flex items-center pr-3 h-13 bg-amber-100">
              <form onSubmit={handleSearch}>
                <input
                type="text"
                placeholder="Enter City"
                value={cityInput}
                onChange={(e)=>{
                  setCityInput(e.target.value)
                }}
                className="bg-amber-100 text-left pl-2 h-13 w-70   outline-none "
              />
              <button type="Submit" className="active:translate-x-[1px] active:translate-y-[1px] hover:bg-gray-200 bg-gray-300 cursor-pointer w-15 h-10  border-l-gray-200 border-l border-t-gray-200 border-t  border-b-black border-b-3 border-r-black border-r-3">
                GO
              </button>
              </form>
              
            </div>
          
 <button onClick={handleSearchGeo} className=" mt-7 cursor-pointer bg-gray-300 w-40  h-10 border-l-black border-l border-t-black border-t  border-b-black border-b-4 border-r-black border-r-4  active:translate-x-[1px] active:translate-y-[1px] hover:bg-gray-200">
              Use My location
            </button>
          
           
            </div>
            </div>
  ) : (
    //  ntchwit
    <div>
       <div className="h-73 w-113 bg-white flex flex-col space-y-3  border mt-2 border-2">
         <p className="flex justify-center mt-4 text-2xl font-semibold">STATS</p>
         <div className="mx-4 text">
          <p className="text-lg">City : <span className="text-gray-600">{weatherData.name}</span></p>
          <p className="text-lg">Temperature : <span className="text-gray-600">{weatherData.temp}</span></p>
          <p className="text-lg">Condition : <span className="text-gray-600">{weatherData.condition}</span></p>
          <p className="text-lg">Humidity : <span className="text-gray-600">{weatherData.humidity}</span></p>
          <p className="text-lg">Wind Speed : <span className="text-gray-600">{weatherData.windspeed}</span></p>
          <p className="text-lg">Time : <span className="text-gray-600">{weatherData.time}</span></p>
         
         <img
  src={`https:${weatherData.icon}`}
  alt="Weather icon"
/>
         </div>
         <div className="w-full flex justify-center">
           <button onClick={exit} className=" w-40  text-black  h-9 font-bold bg-gray-300  border-l-black border-l border-t-black border-t  border-b-black border-b-3 border-r-black border-r-3  active:translate-x-[1px] active:translate-y-[1px] hover:bg-gray-200">◀ BACK</button>
         </div>
           
        </div>
    </div>
  )
}
        
          
        </div>
      </div>
    </div>
  );
};

export default App;
