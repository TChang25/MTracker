import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import Logout from "./components/ui/Logout";
import { useUser } from "./UserContext";
import { ProgressWithValue } from "./components/ProgressWithValue";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Input } from "./components/ui/input";
// Function to handle the button click

const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
};

interface streakObj{
    id: number;
    user_id: number;
    date_worked: string;
    hours_worked: number;
    work_flag: number;

}

export default function Dashboard() {
    const [isDisabled, setIsDisabled] = useState(true); // State to manage button disabled status
    const [lastCheckInDate, setLastCheckInDate] = useState('');
    const [checkIn, setCheckIn] = useState(false);

    const [streaks, setStreaks] = useState([]);
    const [longestStreak, setLongestStreak] = useState(0);
    const [longestStreakFromToday, setLongestStreakFromToday] = useState(0);

    const [hours, setHours] = useState(0);
    const [progress, setProgress] = useState(0);
    const identity = useUser();

    const hoursInput = useRef<HTMLInputElement>(null);

    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-CA', options);

    useEffect(() => {
        const endpoint = '/api/checkin';
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 
        let url = baseUrl + endpoint
        // Function to fetch the latest check-in date
        const fetchLastCheckInDate = async () => {
            setIsDisabled(true);
           
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include', // Include HTTP-only cookies
                });
        
                if (response.ok) {
                    const result = await response.json();
                    setLastCheckInDate(result.latest_date); // Set the last check-in date
                    setIsDisabled(true);
                } else {
                    console.error('Failed to fetch the last check-in date.');
                }
            } catch (error) {
                console.error('Error fetching last check-in date:', error);
                setIsDisabled(false);
            }
        };
    
        fetchLastCheckInDate();
    }, [checkIn]);

    useEffect(() => {
        const fetchStreaks = async () => {
            try {
                const response = await fetch(`/api/allstreaks?id=${identity.user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setStreaks(data);
            } catch (err) {
                console.error('Error fetching streaks:', err);
            }
        };

        fetchStreaks();
    }, [identity, checkIn]); // Dependency array, fetch when userId or when user checks in
    
    useEffect(() => {
        setIsDisabled(lastCheckInDate === formattedToday);
    }, [lastCheckInDate, formattedToday]);

    useEffect(() => {
        function countConsecutiveDaysWorked(streaks: streakObj[]): number {
            // Extract and normalize unique dates
            const uniqueDates = Array.from(
                new Set(streaks.map(streak => new Date(streak.date_worked).setHours(0, 0, 0, 0)))
            );
        
            // Sort the dates
            uniqueDates.sort((a, b) => a - b);
        
            let maxConsecutive = 0;
            let currentConsecutive = 1;
        
            for (let i = 1; i < uniqueDates.length; i++) {
                // Check if the current date is the next day of the previous date
                const diff = (uniqueDates[i] - uniqueDates[i - 1]) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    currentConsecutive++;
                } else {
                    maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
                    currentConsecutive = 1; // Reset for the next sequence
                }
            }
        
            // Check the last sequence
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        
            return maxConsecutive;
        }
        setLongestStreak(countConsecutiveDaysWorked(streaks));
    }, [streaks])


    useEffect(() => {
        function countStreakFromToday(streaks: streakObj[]): number {
            // Get today's date normalized
            const today = new Date();
            today.setHours(0, 0, 0, 0);
        
            // Extract and normalize unique dates from the streaks
            const uniqueDates = Array.from(
                new Set(streaks.map(streak => new Date(streak.date_worked).setHours(0, 0, 0, 0)))
            );
        
            // Sort the dates
            uniqueDates.sort((a, b) => a - b);
        
            let streakCount = 0;
            console.log(uniqueDates);
            // Iterate from today backwards
            for (let i = uniqueDates.length - 1; i >= 0; i--) {
                const diff = (today.getTime() - uniqueDates[i]) / (1000 * 60 * 60 * 24);
                
                // Check if the date is today or a previous consecutive day
                if (diff === streakCount || diff === streakCount + 1) {
                    streakCount++;
                } else if (diff > streakCount) {
                    break; // Stop if a non-consecutive day is encountered
                }
            }
        
            return streakCount;
        }
        setLongestStreakFromToday(countStreakFromToday(streaks));
    }, [streaks])

    useEffect(() => {
        function calculateTotalHoursWorked(streaks: streakObj[]): number {
            return streaks.reduce((total, streak) => total + streak.hours_worked, 0);
        }
        setHours(calculateTotalHoursWorked(streaks));
    },[streaks])
    
    useEffect(() => {
        setProgress(() => {
            return (hours/10000) * 100;
        })
    },[hours])


    const handleClick = async (today: String) => {
        const hoursWorked = hoursInput.current?.value ? hoursInput.current?.value : .5;
        // Prepare the data to send/*
        const data = {
          date_worked: today,
          hours_worked: hoursWorked,
        };
        
        const endpoint = '/api/checkin';
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 
        let url = baseUrl + endpoint;
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
            setCheckIn(true);
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
                        Your longest streak has been: {longestStreak}
                        
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleClick(formattedToday)} disabled={isDisabled}>
                            Check-In
                        </Button>
                        <Input disabled={isDisabled} ref={hoursInput}  max={24} min={.5} step={.5} placeholder="Enter your hours for checking in. By default will be '.5'"type="number">
                        </Input>
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
                            {streaks.length}
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
                            {longestStreakFromToday}
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
            <div className="col-start-3 col-end-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-direction-row place-content-between">
                            <span className="self-center"> Streak History </span> <img width={45} src='..\list-check.svg'></img>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>A list of your recent streaks.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Check-in Date</TableHead>
                                    <TableHead>Hours Logged</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {streaks.map((streak:streakObj, index:number) => {
                                    return (
                                        <TableRow key={streak.id}>
                                            <TableCell> {index} </TableCell>
                                            <TableCell> {streak.date_worked}</TableCell>
                                            <TableCell> {streak.hours_worked}</TableCell>
                                        </TableRow>

                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
            <div className="col-start-9 col-end-10 w-full">
                <Logout></Logout>
            </div>
        </div>
        
        
        

        
        
        
    </>
    );
}