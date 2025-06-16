import { Table } from "lucide-react"
import { TableCaption, TableHeader, TableRow, TableHead, TableBody } from "./components/ui/table"


// Define the structure of a Friend object
/*
interface Friend {
    id: number;
    user_id: number;
    friend_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_on: string;  // ISO timestamp or date string
}
    */
const friends = [
    {
        id: 1,
        user_id: 101,
        friend_id: 102,
        status: 'pending',
        created_on: '2024-10-20 10:45:00'
    },
    {
        id: 2,
        user_id: 101,
        friend_id: 103,
        status: 'accepted',
        created_on: '2024-09-15 12:30:00'
    },
    {
        id: 3,
        user_id: 104,
        friend_id: 105,
        status: 'pending',
        created_on: '2024-10-01 08:00:00'
    },
    {
        id: 4,
        user_id: 106,
        friend_id: 107,
        status: 'accepted',
        created_on: '2024-07-21 14:50:00'
    }
];

function getFriendCount(){
    return friends.length;
}

export default function Friends(){
    return (
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
                Friends Count: 
                {getFriendCount()}
            </TableBody>
        </Table>
    )
}
module.exports = getFriendCount;