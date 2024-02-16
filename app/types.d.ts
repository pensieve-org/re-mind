declare type UserDetails = {
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
    profilePicture: string,
}

declare type UserEvents = EventDetails[];

type HomeTabState = "memories" | "calendar";

type EventRoutes = "live" | "past" | "future";

declare type EventDetails = {
    eventId: string,
    eventName: string,
    startTime: Date,
    endTime: Date,
    thumbnail: string,
    status: "past" | "live" | "future",
    uploadFlag: boolean
}

declare type ImageDetails = {
    imageId: string,
    imageUrl: string,
    queued: boolean,
    tagged: string[],
    uploadTime: Date,
    uploadedBy: string
    iosImageId: string
}

declare type UserType = "guest" | "admin" | "invited";

declare type FriendStatus = "requested" | "accepted";

declare type EventStatus = "past" | "live" | "future";