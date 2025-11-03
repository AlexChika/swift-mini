import { getCloudinaryUrl } from "./helpers";

function formatUserNames2(chat: ChatLean, id: string) {
  const isDuoChat = chat.chatType === "duo";

  if (!isDuoChat) {
    return {
      avatar: getCloudinaryUrl({
        folder: "swift-group-chats",
        publicId: chat.id,
        options: {
          width: 500,
          height: 500
        }
      }),
      usernames: chat.chatName,
      name: chat.chatType
    };
  } else {
    const otherUser = chat.duo_chat_members.find((m) => m.memberId !== id);

    return {
      usernames: otherUser?.member.username || "",
      avatar: otherUser?.member.image || undefined,
      name: chat.chatType
    };
  }
}

// function formatUserNames(
//   participants: Conversation["participants"],
//   id: string,
//   type?: "long"
// ) {
//   if (participants.length < 1)
//     return {
//       usernames: "",
//       avatar: undefined,
//       name: ""
//     };

//   //   sort array to put name of lastmessage sender at the begining
//   const sorted: Conversation["participants"] = [];

//   participants.forEach((p) => {
//     if (p.hasSeenLatestMessage) {
//       sorted.unshift(p);
//     } else {
//       sorted.push(p);
//     }
//   });

//   /** Joins usernames into a comma separated strings while ommitting the current user */
//   function joinUserNames(c: Conversation["participants"]) {
//     return c
//       .map((p) => {
//         if (p.user.id === id) return "";
//         const username = p.user.username!;
//         // make the first letter uppercase
//         return capitalize(username);
//       })
//       .filter((name) => name.length > 1) // filter empty names
//       .join(", "); // join using comma
//   }

//   function capitalize(str: string) {
//     return str.substring(0, 1).toUpperCase() + str.substring(1);
//   }

//   function comma(length: number) {
//     return length < 3 ? "" : ",";
//   }

//   // filter out current user's participantObject
//   const thisUser = participants.find((p) => p.user.id === id);
//   let usernames: string = "";

//   if (type === "long") {
//     let name: string;
//     let usernames: string;
//     const avatar: string | undefined = sorted[0].user.image || undefined;

//     if (thisUser && thisUser.hasSeenLatestMessage) {
//       name = "You";
//       usernames = joinUserNames(sorted);
//     } else {
//       const [first, ...rest] = sorted;
//       name = capitalize(first.user.username || "");
//       usernames = `${joinUserNames(rest)}${comma(sorted.length)} You`;
//     }

//     return {
//       name,
//       usernames,
//       avatar
//     };
//   }

//   //  shortened usernames
//   if (thisUser && thisUser.hasSeenLatestMessage) {
//     const length = sorted.length - 3; // first two names + user's name = 3 names
//     const lastUserName = length > 0 ? `and ${length} other(s)` : "";

//     const fewNames = joinUserNames(
//       sorted.filter((p) => p.user.id !== id).slice(0, 2) // first two names
//     );

//     usernames = `You to ${fewNames} ${lastUserName}`;
//   } else {
//     const [first, ...rest] = sorted;
//     const length = rest.length - 3; // first two names + user's name = 3 names

//     const fewNames = joinUserNames(
//       rest.filter((p) => p.user.id !== id).slice(0, 2) // first two names
//     );

//     const firstUserName = capitalize(first.user.username || "");
//     const lastUserName = length > 0 ? `and ${length} others` : "";

//     usernames = `${firstUserName} to You${comma(
//       sorted.length
//     )} ${fewNames} ${lastUserName}`;
//   }

//   return {
//     usernames,
//     avatar: sorted[0].user.image || undefined,
//     name: usernames.substring(0, 1)
//   };
// } // bugs in  func

function dateFormatter(rawdate: string | number | Date) {
  const d = new Date(rawdate);

  /* ------------ // time of day ----------- */
  const hour = d.getHours();
  const min = d.getMinutes();
  let timeOfDay = "";
  let meridian: "AM" | "PM" = "PM";

  if (hour < 12) {
    meridian = "AM";
  }

  if (hour < 6) {
    timeOfDay = "Night";
  } // 12 (00) am <=> 5:59 am

  if (hour >= 6 && hour < 12) {
    timeOfDay = "Morning";
  } // 6am <=> 11:59am

  if (hour >= 12 && hour < 18) {
    timeOfDay = "Afternoon";
  } // 12pm <=>5:59pm

  if (hour >= 18 && hour < 21) {
    timeOfDay = "Evening";
  } // 6pm <=> 8:59pm

  if (hour >= 22) {
    timeOfDay = "Night";
  } // 9pm <=> 11:59pm

  /* ------------  time ----------- */
  const time = `${hour > 12 ? hour - 12 : hour}:${min} ${meridian}`;

  /* ------------  date ----------- */
  const date = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    year: "numeric",
    day: "numeric"
  }); // full date

  /**
   *
   * @param limit (a number that specifies the max no of days when timepassed is returned) when time in days is greater than limit in days passed, a datestring is returned rather than the time passeed
   * @returns a datestring or time passed
   */
  function getTimePassed(limit?: number) {
    const milliseconds = Date.now() - d.getTime();
    const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);

    // return date if days is greter than limit
    if (limit && Math.floor(days) > limit) return date;

    // under a day
    if (days < 1) {
      const seconds = milliseconds / 1000;
      const mins = seconds / 60;
      const hours = mins / 60;

      // its being seconds
      if (hours < 1 && mins < 1) return `${Math.floor(seconds)} seconds ago`;

      // its being minutes
      if (hours < 1 && mins < 2) return `a minute ago`;
      if (hours < 1 && mins < 60) return `${Math.floor(mins)} minutes ago`;

      // its being hours
      if (hours > 1 && hours < 2) return `an hour ago`;
      if (hours > 1 && hours < 24) return `${Math.floor(hours)} hours ago`;
    }

    // days ago
    if (days < 2) return `one day ago`;
    if (days < 7) return `${days} days ago`;

    // weeks ago
    const weeks = days / 7;
    if (weeks < 2) return `a week ago`;
    if (weeks < 4) return `${Math.floor(weeks)} weeks ago`;

    // months ago
    const months = weeks / 4;
    if (months < 2) return `a month ago`;
    if (months < 52) return `${Math.floor(months)} months ago`;

    // years ago
    const years = months / 12;
    if (years < 2) return `a year ago`;
    else return `${Math.floor(years)} years ago`;
  }

  function getTimeOfWeek() {
    const milliseconds = Date.now() - d.getTime();
    const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    if (Math.floor(days) >= 7) return date; // its been a week

    // currDay = day of tweet ... actualDay = day of viewing
    const currDay = new Date(Date.now()).getDay();
    const actualDay = d.getDay();

    //  time differece is less or equalto 24 hrs
    if (days <= 1) {
      if (currDay === actualDay) return "Today";
      else return "Yesterday";
    }

    return weekDays[actualDay];
  }

  return {
    meridian,
    timeOfDay,
    date,
    time,
    getTimePassed,
    getTimeOfWeek
  };
}

const sampleUsers: User[] = [
  { id: "1231", username: "ochkika", _id: "lol" },
  { id: "1232", username: "omhkika", _id: "lol" },
  { id: "1233", username: "oahkika", _id: "lol" },
  { id: "1234", username: "fahkika", _id: "lol" },
  { id: "1235", username: "fzhkika", _id: "lol" },
  { id: "1236", username: "fqhkika", _id: "lol" },
  { id: "1237", username: "gchkika", _id: "lol" },
  { id: "1238", username: "gdhkika", _id: "lol" },
  { id: "1239", username: "gyhkika", _id: "lol" },
  { id: "0123", username: "glhkika", _id: "lol" },
  { id: "11123", username: "hchkika", _id: "lol" },
  { id: "1223", username: "hohkika", _id: "lol" },
  { id: "13203789", username: "hphkika", _id: "lol" },
  { id: "1423", username: "hahkika", _id: "lol" },
  { id: "1523", username: "inhkika", _id: "lol" },
  { id: "1623", username: "ifhkika", _id: "lol" },
  { id: "1723", username: "ixhkika", _id: "lol" },
  { id: "1823", username: "iphkika", _id: "lol" },
  { id: "1923", username: "jlhkika", _id: "lol" },
  { id: "2023", username: "jahkika", _id: "lol" },
  { id: "2123", username: "jnhkika", _id: "lol" },
  { id: "22123", username: "jqhkika", _id: "lol" },
  { id: "23123", username: "kphkika", _id: "lol" },
  { id: "24123", username: "kahkika", _id: "lol" },
  { id: "25123", username: "kzhkika", _id: "lol" },
  { id: "1263", username: "pihkika", _id: "lol" },
  { id: "1273", username: "plhkika", _id: "lol" },
  { id: "1283", username: "pchkika", _id: "lol" },
  { id: "1293", username: "lchkika", _id: "lol" },
  { id: "1230", username: "achkika", _id: "lol" },
  { id: "3123", username: "mchkika", _id: "lol" },
  { id: "32123", username: "nchkika", _id: "lol" },
  { id: "1323", username: "echkika", _id: "lol" },
  { id: "33123", username: "cchkika", _id: "lol" },
  { id: "34123", username: "dchkika", _id: "lol" },
  { id: "35123", username: "bchkika", _id: "lol" },
  { id: "36123", username: "7chkika", _id: "lol" },
  { id: "37123", username: "7czhkika", _id: "lol" },
  { id: "38123", username: "7mchkika", _id: "lol" },
  { id: "39123", username: "7qchkika", _id: "lol" }
];

export { dateFormatter, formatUserNames2, sampleUsers };
