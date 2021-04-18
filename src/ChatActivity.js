const fetch = require('node-fetch');

export const ActivityStatus = {
  ACTIVE: 1,
  IDLE: 2,
  DISCONNECTED: 3
};

const MAX_IDLE_TIME_MINUTES = 10;

export default class ChatActivity {
  constructor(channel) {
    this.channel = channel;
    this.lastMessageTimes = {};
    this.getStatus = this.getStatus.bind(this);
  }

  updateLastMessageTime = (user) => {
    this.lastMessageTimes = {
      ...this.lastMessageTimes,
      [user]: Date.now()
    };
  }

  minsSinceLastChatMessage = (user) => {
    return Math.floor((Date.now()-this.lastMessageTimes[user])/60000);
  }

  async getStatus(user) {
    // broadcaster always counts as active
    if(user === this.channel) {
      return ActivityStatus.ACTIVE;
    }

    // sent a chat message in the last X mins?
    if(this.lastMessageTimes[user] && this.minsSinceLastChatMessage(user) < MAX_IDLE_TIME_MINUTES) {
      return ActivityStatus.ACTIVE;
    }

    // check the twitch api to see if they have an active connection to chat.
    // (thank the lord almighty for free open proxy sites. CORB is annoying.)
    // note that results are fairly heavily cached, and the API may break
    // eventually (is undocumented), but this is what twitch themselves
    // uses to display the list of people connected to chat - best we got.
    return fetch(`https://thingproxy.freeboard.io/fetch/https://tmi.twitch.tv/group/user/${this.channel}/chatters`)
      .then(r => r.json())
      .then(res => {
        console.log(res);
        if(!res.chatters) {
          return ActivityStatus.DISCONNECTED; // in case the response doesn't parse goodly
}
        if(res.chatters.vips.includes(user)
           || res.chatters.moderators.includes(user)
           || res.chatters.viewers.includes(user)
           || res.chatters.staff.includes(user)
           || res.chatters.admins.includes(user)
           || res.chatters.global_mods.includes(user)
        ) {
          console.log("IDLEEE")
          return ActivityStatus.IDLE;
        }
        return ActivityStatus.DISCONNECTED;
      })
      .catch((e) => {
        console.log(e);
      })
  }
}
