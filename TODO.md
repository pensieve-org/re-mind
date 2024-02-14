# TODO List

### Completed
- [x] remove the scale from friends list component, make a new component for friend requests. FIX THE SCROLL
- [x] make create event screen
- [x] hook up screen to APIs
- [x] add to event screen (display attendees, add attendees button)
- [x] add an add friends search bar to profile
- [x] display all friends on profile screen
- [x] look at react-native-animatable for animations, maybe wrap layout in a animated view? (https://youtu.be/a8VWnpwn5Pk)
- [x] Save SQL branch
- [x] Merge migration to main (delete api code)
- [x] Make sure the calendar events are sorted by date, first appear first etc
- [x] Deleting an event should delete the thumbnail and all images from storage
- [x] Deleting a user should delete the profile picture

### Essential
- [x] Cloud function - make a cloud function to update all future and live event statuses
- [ ] Caching - minimise the number of firebase calls
- [ ] Optimise code (use batch queries?)
- [x] Image upload to live events
- [x] Look at how to auto reload when something changes in firebase (we should be able to auto trigger the background image upload for a user if an event status they are part of is set to live by the cloud function)
- [x] Event invitations? should go on profile? When added, remember to delete when event is deleted. 
- [ ] go through all screens and clean up 


### Features?
- [ ] Allow admins to make other admins, add/remove users, add event thumbnail, from edit event screen
- [ ] Allow users to pin events to their profile? (or figure out what else should go on a profile? and About section?)
- [ ] Allow users to click into other users profiles?
- [ ] Apple/google/FB sign in
- [ ] Allow users to comment/react to images
- [ ] Allow post announcements on upcoming events
- [ ] Past events should have a timeline, click on a point and it will show all images taken at that time
