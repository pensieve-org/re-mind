declare type UserDetails = {
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    profilePicture: string,
}

declare type EventDetails = {
    eventId: string,
    eventName: string,
    startTime: Date,
    endTime: Date,
    thumbnail: string,
    status: "past" | "live" | "future"
}

declare type UserType = "guest" | "admin";

declare type FriendStatus = "requested" | "accepted";

declare type EventStatus = "past" | "live" | "future";