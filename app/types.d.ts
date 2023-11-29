declare type User = {
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    profilePicture: string,
}

declare type Event = {
    eventId: string,
    eventName: string,
    startTime: Date,
    endTime: Date,
    thumbnail: string,
    status: "past" | "live" | "future"
}