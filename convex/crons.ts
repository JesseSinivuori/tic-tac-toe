import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "delete old rooms",
  { hourUTC: 4, minuteUTC: 0 }, // Every day at 4:00am UTC
  internal.rooms.delete24HoursOldRooms,
);

export default crons;
