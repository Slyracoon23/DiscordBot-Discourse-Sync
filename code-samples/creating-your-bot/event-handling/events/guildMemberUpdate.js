const axios = require("axios");
const { Api_Key, Api_Username } = require("../config.json");
const { discord_test } = require("../groups.json");

module.exports = {
	name: "guildMemberUpdate",
	async execute(oldMember, newMember) {
		//console.log(oldMember, newMember);
    
    let defaultHost = "forum.citydao.io";
    
    /* 
    / Grab object for the new role
    / newRoleId = ID of the changed Role
    / newRoleName = Name of the changed Role
    */
    let newRole = newMember.roles.cache.difference(oldMember.roles.cache).last();
    let newRoleId = newRole.id;
    let newRoleName = newRole.name; 
		//console.log(newRole);
		console.log(`Role ID: ${newRoleId}`);
		console.log(`Role Name: ${newRoleName}`);

    /*
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
      console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
    }

    // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
      console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
    }
    */


		//console.log(newMember.roles.cache);
    // Check whether we added or removed roles
    newMemberSize = newMember.roles.cache.size;
    oldMemberSize = oldMember.roles.cache.size;
		console.log(`new size: ${newMemberSize}`);
		console.log(`old size: ${oldMemberSize}`);
		// needed to +1 for oldMemberSize due to @everyone role in discord
    if(newMemberSize > oldMemberSize) {
      // add logic for added role
      console.log("role added");
    } else {
      // add logic for removed role
      console.log("role removed");
    };
    


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

    let postUrl = `https://${defaultHost}/groups/${discord_test}/members.json`;

    let data = {
      "usernames": MemberName
    }
    let putData = JSON.stringify(data);
    
    const headers = {
      "Content-Type": "application/json",
      "Api-Key": Api_Key,
      "Api-Username": Api_Username
    };

    // If the username exist it will be added to the group
    /*axios
      .get(url)
      // Check username exist on discourse
      .then(( res ) => {
        console.log(res.status);
        // User found
        // Add user to the group if they were added to the role
        if (newMemberSize > oldMemberSize+1) { 
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
            data: data
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
        console.error("Username does not exist on Discourse");
      });
      */
    console.log(postUrl);
    // Add user to a group
    // API endpoint "Add group members"
    // METHOD: PUT
    // https://{defaultHost}/groups/{id}/members.json
    //
    //
	},
};