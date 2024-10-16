import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import Logout from "./components/ui/Logout";
import { useUser } from "./UserContext";
import { ProgressWithValue } from "./components/ProgressWithValue";


// Function to handle the button click

const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
};

export default function Dashboard() {

    const [isDisabled, setIsDisabled] = useState(true); // State to manage button disabled status
    const [lastCheckInDate, setLastCheckInDate] = useState('');
    const numberOfTotalDays = (0);
    const streak = (0);
    
    const hours = (250);
    const progress = ((hours/10000) * 100);
    const identity = useUser();

    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-CA', options);

    useEffect(() => {
        const endpoint = '/api/checkin';
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 
        let url = baseUrl + endpoint
        // Function to fetch the latest check-in date
        const fetchLastCheckInDate = async () => {
          try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Include HTTP-only cookies
            });
    
            if (response.ok) {
                const result = await response.json();
                setLastCheckInDate(result.latest_date); // Set the last check-in date
            } else {
                console.error('Failed to fetch the last check-in date.');
            }
          } catch (error) {
            console.error('Error fetching last check-in date:', error);
          }
        };
    
        fetchLastCheckInDate();
    }, []);

    

    
    useEffect(() => {
        setIsDisabled(lastCheckInDate === formattedToday);
    }, [lastCheckInDate, formattedToday]);

    console.log(identity);

    const handleClick = async (today: String) => {
        const hoursWorked = 1;
      
        // Prepare the data to send
        const data = {
          date_worked: today,
          hours_worked: hoursWorked,
        };
    
        const endpoint = '/api/checkin';
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 
        let url = baseUrl + endpoint
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include', // Include HTTP-only cookies in the request
          });
      
          const result = await response.json();
      
          if (response.ok) {
            alert(`Streak logged successfully! ID: ${result.id}`);
          } else {
            alert(`Error: ${result.error}`);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while logging the streak.');
        }
    };
    
    return ( 
    <>
        
        <div className="grid grid-cols-12 gap-4 mt-10">
            <div className="col-start-3 col-end-9">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Hello, {identity.user?.first_name}
                </h1>
            </div>

            <div className="col-start-3 col-end-10">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Make sure to check in everyday to log your progress!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p>
                        Today's date: {formattedToday}
                        </p>
                        { lastCheckInDate ? <p className="text-green-400"> You last checked in on: {lastCheckInDate} </p> : <p className="text-red-400">No check in detected for this user.</p> }
                        
                        
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleClick(formattedToday)} disabled={isDisabled}>
                            Check-In
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="col-start-3 col-end-5">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-direction-row place-content-between">
                            <span className="self-center"> Total days </span> <img width={45} src='..\calendar.svg'></img>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                            {numberOfTotalDays}
                        </h2>
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
            <div className="col-start-5 col-end-7">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-direction-row place-content-between">
                            <span className="self-center"> Current Streak </span> <img width={45} src='..\fire.svg'></img>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ">
                            {streak}
                        </h2>
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
            <div className="col-start-7 col-end-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-direction-row place-content-between">
                            <span className="self-center"> Total Hours of Work </span> <img width={45} src='..\power.svg'></img>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ">
                            {hours}
                        </h2>
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
            <div className="col-start-3 col-end-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-direction-row place-content-between">
                            <span className="self-center"> 10,000 Hour Mastery Progress </span> <img width={45} src='..\star-rainbow.svg'></img>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">

                    <div className="w-full space-y-2 px-10">
                        <div>
                            <div className="text-blue-500"> {hours} / 10,000</div>
                            <ProgressWithValue value={progress}></ProgressWithValue>
                        </div>
                    </div>
                        
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
            <div className="col-start-10 col-end-12">

            </div>
            <div className="col-start-9 col-end-10">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    <Logout></Logout>
                </h1>
            </div>
        </div>
        
        
        

        
        
        
    </>
    );
}