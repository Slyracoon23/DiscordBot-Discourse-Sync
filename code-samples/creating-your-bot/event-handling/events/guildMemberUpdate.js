const axios = require("axios");
const { Api_Key, Api_Username } = require("../config.json");
const {
	discord_citizen,
	discord_founding,
} = require("../groups.json");
const { checker, addRemoveRole } = require("../utils.js");

module.exports = {
	name: "guildMemberUpdate",
	async execute(oldMember, newMember) {
		//console.log(oldMember, newMember);

		const defaultHost = "forum.citydao.io";

		// Counter to check whether role was ADDED or REMOVED.
		// Counter = 1 (role is added)
		// Counter = 0 (role is removed)
		// Default behavior: bot will always consider the first event
		// after start/restart on each user as a ROLE ADDED event.
		let counter = 1;

		// Check to see if the structure we called on is partial or not.
		if (oldMember.partial) {
			// If it's partial we will retrieve the missing data from the API.
			// Note: this will prevent empty roles on oldMember after bot restart.
			oldMember
				.fetch()
				.then((fullMember) => {
					counter = checker(fullMember, newMember);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			counter = checker(oldMember, newMember);
		}

		console.log(`counter: ${counter}`);

		/* 
    / MemberNickName = Discord nickname of the current user (string).
    / MemberId = Discord ID of the current user (snowflake).
    / MemberName = Discord username (if no username then nickname) of the current user (string).
    */
		const MemberNickName = newMember.nickname;
		const MemberId = newMember.id;
		const MemberName = newMember.displayName;
		//console.log(`Nickname: ${MemberNickName}`);
		//console.log(`ID: ${MemberId}`);
		//console.log(`Name: ${MemberName}`);

		// Check whether discord user name exist on discourse/forum.
		// API endpoint "Get a single user by username".
		// METHOD: GET
		//
		//
		const url = `https://${defaultHost}/u/${MemberName}.json`;
		console.log(url);

		//let postUrl = `https://${defaultHost}/groups/${discord_test}/members.json`;

		const data = {
			usernames: MemberName,
		};
		const putData = JSON.stringify(data);

		const headers = {
			"Content-Type": "application/json",
			"Api-Key": Api_Key,
			"Api-Username": Api_Username,
		};

		/* 
    / Grab object for the new role
    / newRoleId = ID of the changed Role
    / newRoleName = Name of the changed Role
    */
		const newRole = newMember.roles.cache
			.difference(oldMember.roles.cache)
			.last();
		const { id: newRoleId, name: newRoleName } = newRole;
		//let newRoleId = newRole.id;
		//let newRoleName = newRole.name;
		console.log(`Role ID: ${newRoleId}`);
		console.log(`Role Name: ${newRoleName}`);

		if (newRoleName == "test-role-1") {
			const postUrl = `https://${defaultHost}/groups/${discord_founding}/members.json`;
			addRemoveRole(url, headers, data, putData, postUrl, newRoleName, counter);
		} else if (newRoleName == "test-role-2") {
			const postUrl = `https://${defaultHost}/groups/${discord_citizen}/members.json`;
			addRemoveRole(url, headers, data, putData, postUrl, newRoleName, counter);
		}

		//console.log(postUrl);
	},
};
