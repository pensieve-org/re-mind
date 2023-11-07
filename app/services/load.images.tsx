import getEvents from "./get.events";

// TODO: remove this file/code and replace with proper sql

export async function loadImages() {
  const ongoingEvents = await getEvents(1);
  const pastEvents = await getEvents(5);

  const ongoing = ongoingEvents.map((image, index) => ({
    image: image,
    id: `ongoing-${index}`,
  }));
  const past = pastEvents.map((image, index) => ({
    image: image,
    id: `past-${index}`,
  }));

  return { ongoing, past };
}
