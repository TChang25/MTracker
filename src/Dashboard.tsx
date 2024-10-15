import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import Logout from "./components/ui/Logout";
import { useAuth } from "./AuthProvider";


// Function to handle the button click

const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
};

export default function Dashboard() {

    const [isDisabled, setIsDisabled] = useState(true); // State to manage button disabled status
    const [lastCheckInDate, setLastCheckInDate] = useState('');
    const { user } = useAuth();

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
        
        <div className="grid grid-cols-4 gap-4">
            <div className="col-start-2 col-end-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Hello, {user}
                </h1>
            </div>
            <div className="col-start-4 col-end-5">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    <Logout></Logout>
                </h1>
            </div>
            <div className="col-start-2 col-end-4">
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
        

        </div>
        
        
        

        
        
        
    </>
    );
}