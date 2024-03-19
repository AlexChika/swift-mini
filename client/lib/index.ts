function formatUserNames(
  participants: Conversation["participants"],
  id: string,
  type?: "long"
) {
  if (participants.length < 1)
    return {
      usernames: "",
      avatar: "",
      name: "",
    };

  //   sort array to put name of lastmessage sender at the begining
  let sorted: Conversation["participants"] = [];
  participants.forEach((p) => {
    p.hasSeenLatestMessage ? sorted.unshift(p) : sorted.push(p);
  });

  function joinUserNames(p: Conversation["participants"]) {
    return p
      .map((p) => {
        if (p.user.id === id) return "";
        const username = p.user.username!;
        // make the first letter uppercase
        return capitalize(username);
      })
      .filter((name) => name.length > 1) // filter empty names
      .join(", "); // join using comma
  }

  function capitalize(str: string) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  function comma(length: number) {
    return length < 3 ? "" : ",";
  }

  // filter out current user's participantObject
  const thisUser = participants.find((p) => p.user.id === id);
  let usernames: string = "";

  if (type === "long") {
    let name: string;
    let usernames: string;
    let avatar: string | undefined = sorted[0].user.image || undefined;

    if (thisUser && thisUser.hasSeenLatestMessage) {
      name = "You";
      usernames = joinUserNames(sorted);
    } else {
      const [first, ...rest] = sorted;
      name = capitalize(first.user.username || "");
      usernames = `${joinUserNames(rest)}, You`;
    }

    return {
      name,
      usernames,
      avatar,
    };
  }

  if (participants.length < 4) {
    if (thisUser && thisUser.hasSeenLatestMessage) {
      let names = joinUserNames(sorted.slice(0, sorted.length - 1));
      const lastUserName = sorted[sorted.length - 1].user.username!;

      usernames = `You${comma(sorted.length)} ${names} and ${capitalize(
        lastUserName
      )}`;
    } else {
      let names = joinUserNames(sorted);
      usernames = `${names} and You`;
    }
  } else {
    const length = participants.length - 3; // first two names + user's name = 3 names
    const lastUserName = `and ${length} others`;

    let names = joinUserNames(
      sorted.filter((p) => p.user.id !== id).slice(0, 2) // first two names
    );

    if (thisUser && thisUser.hasSeenLatestMessage) {
      usernames = `You, ${names} ${lastUserName}`;
    } else {
      usernames = `${names} You ${lastUserName}`;
    }
  }

  return {
    usernames,
    avatar: sorted[0].user.image || undefined,
    name: usernames.substring(0, 1),
  };
}

function dateFormatter(rawdate: string | number | Date) {
  const d = new Date(rawdate);

  /* -----------  minute and hour ----------- */
  // example   Hour :  Minute
  //            06  :  45
  // where => hour1 = 0, hour2 = 6, min1 = 4, min2 = 5
  let hour1 = "0"; //   hour boxes
  let hour2;
  let min1 = "0"; //   min boxes
  let min2;

  const hourArray = d.getHours().toString().split("");
  const minArray = d.getMinutes().toString().split("");

  if (hourArray.length > 1) {
    [hour1, hour2] = hourArray;
  } else {
    [hour2] = hourArray;
  }

  if (minArray.length > 1) {
    [min1, min2] = minArray;
  } else {
    [min2] = minArray;
  }

  /* ------------ // time of day ----------- */
  const hour = d.getHours();
  let dayPeriod = "";
  let meridian: "AM" | "PM" = "PM";

  if (hour < 12) {
    meridian = "AM";
  }

  if (hour < 6) {
    dayPeriod = "Night";
  } // 12 (00) am <=> 5:59 am

  if (hour >= 6 && hour < 12) {
    dayPeriod = "Morning";
  } // 6am <=> 11:59am

  if (hour >= 12 && hour < 18) {
    dayPeriod = "Afternoon";
  } // 12pm <=>5:59pm

  if (hour >= 18 && hour < 21) {
    dayPeriod = "Evening";
  } // 6pm <=> 8:59pm

  if (hour >= 22) {
    dayPeriod = "Night";
  } // 9pm <=> 11:59pm

  /* ------------  time ----------- */
  const time = `${
    Number(hour1) ? hour1 : ""
  }${hour2}:${min1}${min2} ${meridian}`;

  /* ------------  date ----------- */
  const date = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    year: "numeric",
    day: "numeric",
  });

  return {
    meridian,
    dayPeriod,
    date,
    time,
  };
}

export { formatUserNames, dateFormatter };
