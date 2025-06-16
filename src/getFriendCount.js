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

module.exports = getFriendCount;