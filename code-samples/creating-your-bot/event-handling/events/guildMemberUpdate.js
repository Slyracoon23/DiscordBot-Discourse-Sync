const axios = require("axios");
const { Api_Key, Api_Username } = require("../config.json");
const { discord_test, discord_citizen, discord_founding } = require("../groups.json");

module.exports = {
	name: "guildMemberUpdate",
	async execute(oldMember, newMember) {
		//console.log(oldMember, newMember);
    
    let defaultHost = "forum.citydao.io";
    let counter = 0;

    // Check to see if the structure we called on is partial or not
    if (oldMember.partial) {
      // If it's partial we will retrieve the missing data from the API
      // note: this will prevent empty roles on oldMember after bot restart
      oldMember.fetch()
        .then(fullMember => {
          counter = checker(fullMember, newMember);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      counter = checker(oldMember, newMember);
    }

    console.log(`counter: ${counter}`);

    /* 
    / MemberNickName = Discord nickname of the current user (string)
    / MemberId = Discord ID of the current user (snowflake)
    / MemberName = Discord username (if no username then nickname) of the current user (string)
    */ 
    let MemberNickName = newMember.nickname;
    let MemberId = newMember.id;
    let MemberName = newMember.displayName;
    console.log(`Nickname: ${MemberNickName}`);
    console.log(`ID: ${MemberId}`);
    console.log(`Name: ${MemberName}`);

    // Check whether discord user name exist on discourse/forum
    // API endpoint "Get a single user by username"
    // METHOD: GET
    //
    //
    let url = `https://${defaultHost}/u/${MemberName}.json`;
    console.log(url);

    //let postUrl = `https://${defaultHost}/groups/${discord_test}/members.json`;

    let data = {
      "usernames": MemberName
    }
    let putData = JSON.stringify(data);
    
    const headers = {
      "Content-Type": "application/json",
      "Api-Key": Api_Key,
      "Api-Username": Api_Username
    };

    /* 
    / Grab object for the new role
    / newRoleId = ID of the changed Role
    / newRoleName = Name of the changed Role
    */
    let newRole = newMember.roles.cache.difference(oldMember.roles.cache).last();
    let newRoleId = newRole.id;
    let newRoleName = newRole.name; 
		console.log(`Role ID: ${newRoleId}`);
		console.log(`Role Name: ${newRoleName}`);

    if (newRoleName == "test-role-1") {
      let postUrl = `https://${defaultHost}/groups/${discord_founding}/members.json`;
      //addRemoveRole(postUrl, newRoleName);
    } else if (newRoleName == "test-role-2") {
      let postUrl = `https://${defaultHost}/groups/${discord_citizen}/members.json`;
      //addRemoveRole(postUrl, newRoleName);
    };

    function checker(a, b) {
      let oldMemberSize = a.roles.cache.size;
      let newMemberSize = b.roles.cache.size;
      console.log(`old size: ${oldMemberSize}`);
      console.log(`new size: ${newMemberSize}`);

        /* 
        / Note: 
        / At BOT restart OldMember will only come with the @everyone role.
        / calling fetch() on partial completes the structure... which is NewMember
        / This means oldMemberSize and newMemberSize will be the same on BOT start.
        / Quick fix:
        / 1. if(newMemberSize >= oldMemberSize)
        /   - first bot event will always be "role added" action.
        /   - subsequent events will behave normally.
        / 
        / 2. if(newMemberSize > oldMemberSize)
        /   - first bot event will always be a "role removed" action.
        /   - subsequent events will be have normally.
        */
        if(newMemberSize >= oldMemberSize) {
          // add logic for added role
          console.log("role added");
          return 1;
        } else {
          // add logic for removed role
          console.log("role removed");
          return 0;
        };
    }

    function addRemoveRole(postUrl, newRoleName) {
      console.log(postUrl);
      axios
      .get(url)
      // Check username exist on discourse
      .then(( res ) => {
        console.log(res.status);
        // User found
        // Add user to the group if they were added to the role
        if (counter==1) { 
          axios.put(postUrl, putData, {
            headers: headers
          })
          .then(( res ) => {
            console.log(`User added to ${newRoleName}.`, res.status);
          })
          .catch((error) => {
            console.log(error);
          })
        } else {
        // Remove user from the group if they were removed from the role
          axios.delete(postUrl, {
            params: data
          }, {
            headers: headers
          })
          .then(( res ) => {
            console.log(`User removed from ${newRoleName}`, res.status);
          })
          .catch((error) => {
            console.log(error);
          })
        }
      })
      .catch((error) => {
        console.error("Username does not exist on Discourse", error);
      });
    };



    // If the username exist it will be added to the group
    /*
    axios
      .get(url)
      // Check username exist on discourse
      .then(( res ) => {
        console.log(res.status);
        // User found
        // Add user to the group if they were added to the role
        if (counter==1) { 
          axios.put(postUrl, putData, {
            headers: headers
          })
          .then(( res ) => {
            console.log(`User added to ${newRoleName}.`, res.status);
          })
          .catch((error) => {
            console.log(error);
          })
        } else {
        // Remove user from the group if they were removed from the role
          axios.delete(postUrl, {
            params: data
          }, {
            headers: headers
          })
          .then(( res ) => {
            console.log(`User removed from ${newRoleName}`, res.status);
          })
          .catch((error) => {
            console.log(error);
          })
        }
      })
      .catch((error) => {
        console.error("Username does not exist on Discourse", error);
      });
      */
    //console.log(postUrl);
	},
};